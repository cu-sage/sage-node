/**
 * Utilities for handling file operations in MongoDB.
 * @author yli 11/18
 */

const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

/**
 * Collection names for files.
 * @enum {string}
 */
const Bucket = {
  JSON: 'jsonFiles',
  SE: 'seFiles',
  SB2: 'sb2Files',
  OTHER: 'otherFiles'
};

/**
 * Finds the collection name for the given filename.
 * This method assumes that the given filename contains a file extension.
 */
const getCollectionName = function (filename) {
  let bucketName;
  if (filename.indexOf('.json') > -1) { // file.mimetype === 'application/json'
    bucketName = Bucket.JSON;
  } else if (filename.indexOf('.se') > -1) {
    bucketName = Bucket.SE;
  } else if (filename.indexOf('.sb2') > -1) {
    bucketName = Bucket.SB2;
  } else {
    bucketName = Bucket.OTHER;
  }
  return bucketName;
};

/**
 * Returns a database file storage.
 */
const getDbStorage = function (mongoose) {
  return new GridFsStorage({
    db: mongoose.connection,
    file: (req, file) => {
      // Set filename
      // TODO: finalize naming convention
      let filename;
      if (file.originalname.indexOf('.sb2') > -1) {
        filename = file.originalname.replace(' ', '_');
      } else {
        filename = Date.now() + file.originalname.replace(' ', '_');
      }

      return {
        filename,
        bucketName: getCollectionName(file.originalname),
        metadata: req.params
      };
    }
  });
};

/**
 * Directly uploads any files to the database.
 * This method will send a response.
 */
const postDbFile = function (mongoose, req, res) {
  const dbUpload = multer({ storage: getDbStorage(mongoose) });
  const testDbUpload = dbUpload.single('fileupload');
  testDbUpload(req, res, function (err) {
    if (err) {
      res.send(err);
      return;
    }
    res.send('uploaded game file to database');
  });
};

/**
 * Directly downloads a file from the database by filename.
 * This method will send a response.
 */
const getDbFile = function (mongoose, req, res) {
  const gfs = Grid(mongoose.connection.db, mongoose.mongo);
  const bucketName = getCollectionName(req.params.filename);
  gfs.collection(bucketName);

  gfs.files.find({ filename: req.params.filename }).toArray(function (err, files) {
    if (err) return err;
    if (!files || files.length === 0) {
      return res.status(404).json({
        responseCode: 1,
        responseMessage: 'error'
      });
    }

    const readStream = gfs.createReadStream({
      filename: files[0].filename,
      root: bucketName
    });
    res.set('Content-Type', files[0].contentType);
    return readStream.pipe(res);
  });
};

/**
 * Directly deletes a file from the database by filename.
 * This method will send a response.
 */
const deleteDbFile = function (mongoose, req, res) {
  const gfs = Grid(mongoose.connection.db, mongoose.mongo);
  const filename = req.params.filename;
  gfs.collection(getCollectionName(filename));
  gfs.files.findOne({ filename }, function (err, file) {
    if (err || !file) {
      res.status(404).send('File Not Found');
      return;
    }
    gfs.files.remove(file, (err) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.send('File Deleted');
    });
  });
};

/**
 * Uploads a JSON string as a .json file to the database.
 * req.body contains the JSON string
 */
const uploadJson = function (mongoose, content, metadata) {
  const gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection(Bucket.JSON);
  const writestream = gfs.createWriteStream({
    filename: metadata.timestamp + '.json',
    mode: 'w',
    content_type: 'application/json',
    encoding: '7bit',
    root: Bucket.JSON,
    metadata
  });
  writestream.write(content);
  writestream.end();
  return new Promise(resolve => {
    writestream.on('close', function (file) {
      resolve(file);
    });
  });
};

/**
 * Uploads an SE string as a .json file to the database.
 * req.body contains the JSON string
 */
const uploadSe = function (mongoose, content, metadata) {
  const gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection(Bucket.SE);
  let filename = metadata.timestamp + '.se';
  if (metadata.hasBlockIds) {
    filename = metadata.timestamp + '_withIDs.se';
  }
  const writestream = gfs.createWriteStream({
    filename,
    mode: 'w',
    root: Bucket.SE,
    metadata
  });
  writestream.write(content);
  writestream.end();
  return new Promise(resolve => {
    writestream.on('close', function (file) {
      resolve(file);
    });
  });
};

/**
 * Downloads .se files from the database as a JSON array.
 * The returned file objects are ordered by timestamp.
 */
const downloadSeFiles = function (mongoose, studentID, gameID, objectiveID, hasBlockIds) {
  const gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection(Bucket.SE);
  return gfs.files.find({
    'metadata.studentID': studentID,
    'metadata.gameID': gameID,
    'metadata.objectiveID': objectiveID,
    'metadata.hasBlockIds': hasBlockIds
  })
    .sort({ 'metadata.timestamp': 1 })
    .toArray()
    .then(files => {
      const filePromises = files.map(file =>
        new Promise(resolve => {
          let data = '';
          let readStream = gfs.createReadStream({
            filename: file.filename,
            encoding: 'utf8'
          });
          readStream.on('data', function (chunk) {
            data += chunk;
          });
          readStream.on('end', function () {
            resolve({ content: data, timestamp: file.metadata.timestamp });
          });
        })
      );
      return Promise.all(filePromises)
        .then(seFiles => {
          return {
            seFiles,
            info: { studentID, gameID, objectiveID, hasBlockIds }
          };
        });
    });
};

module.exports = { postDbFile, getDbFile, deleteDbFile, uploadJson, uploadSe, downloadSeFiles };
