var router = require('express').Router();
var fs = require('fs');
var GameService = require('../services/game.js');
require('../services/objective.js');
var multer = require('multer');
const FileUtils = require('../utils/fileUtils.js');
const JavaUtils = require('../utils/javaUtils.js');
const mongoose = require('mongoose');
const request = require('request-promise-native');

// Disk file storage
const diskStorage = multer.diskStorage({
  destination(req, file, cb) {
    let uploadPath = './uploads/games';
    console.log(fs.existsSync(uploadPath));
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    if (file.originalname.indexOf('.sb2') > -1) {
      cb(null, file.originalname.replace(' ', '_'));
    } else {
      cb(null, Date.now() + file.originalname.replace(' ', '_'));
    }
  }
});
const diskUpload = multer({ storage: diskStorage });

var GameController = function(app) {
  router.get('/:gameID', GameController.fetchGame);
  router.post('/creategame/creategame', GameController.createGame);
  router.post('/updategame/:gameID', GameController.updateGameSE);
  router.post(
    '/updategameinmemory/:gameID',
    GameController.updateGameSEInMemory
  );
  // Post game from Affinity Space every second
  router.get(
    '/link/game/:gameID/objective/:objectiveID',
    GameController.linkGameWithObjective
  );
  router.post(
    '/student/:studentID/game/:gameID/objective/:objectiveID',
    diskUpload.single('file'),
    GameController.submitAndProcess
  );
  router.post(
    '/students/:studentID/assignments/:assignmentID/results',
    diskUpload.single('file'),
    GameController.searchSubmitAndProcess
  );

  var testmulter = diskUpload.single('fileupload');
  router.post('/post', function(req, res, next) {
    testmulter(req, res, function(err) {
      console.log(req.file);
      if (err) {
        console.log(err);
      }
      res.send('upload game request done');
    });
  });

  // scratch fetch game via this router
  router.get('/get/:gameID', function(req, res, next) {
    var filepath = './uploads/games/';
    var filename = req.params.gameID;
    console.log('downloading file with name ' + filepath + filename + '.sb2');
    res.download(filepath + filename + '.sb2', filename + '.sb2', function(
      err
    ) {
      if (err) {
        console.log('error happened : ' + err);
        res.status(404).send('not found');
      }
    });
  });

  // scratch fetch class's feedback
  // TODO
  router.get('/feedback/:gameID', function(req, res, next) {});

  /**
   * Testing route for method FileUtils.postDbFile.
   * Directly uploads any files to the database.
   */
  router.post('/upload/:studentID/:gameID/:objectiveID', function(
    req,
    res,
    next
  ) {
    FileUtils.postDbFile(mongoose, req, res);
  });

  /**
   * Testing route for method FileUtils.getDbFile.
   * Directly downloads a file from the database by filename.
   */
  router.get('/file/:filename', function(req, res, next) {
    FileUtils.getDbFile(mongoose, req, res);
  });

  /**
   * Testing route for method FileUtils.deleteDbFile.
   * Directly deletes a file from the database by filename.
   */
  router.post('/file/delete/:filename', function(req, res, next) {
    FileUtils.deleteDbFile(mongoose, req, res);
  });

  /**
   * Testing route for method FileUtils.uploadJson.
   * Uploads a JSON string as a .json file.
   * req.body contains the JSON string
   * TODO: move timestamp to req.params
   */
  router.post('/uploadJson/:studentID/:gameID/:objectiveID', function(
    req,
    res,
    next
  ) {
    const metadata = {
      studentID: req.params.studentID,
      gameID: req.params.gameID,
      objectiveID: req.params.objectiveID,
      timestamp: Date.now()
    };
    FileUtils.uploadJson(mongoose, req.body, metadata).then(file => {
      res.send(file);
    });
  });

  /**
   * Testing route for method FileUtils.uploadSe.
   * Uploads an SE string as a .se file.
   * req.body contains the SE string
   * TODO: move timestamp to req.params
   */
  router.post(
    '/uploadSe/:studentID/:gameID/:objectiveID/:hasBlockIds',
    function(req, res, next) {
      const metadata = {
        studentID: req.params.studentID,
        gameID: req.params.gameID,
        objectiveID: req.params.objectiveID,
        hasBlockIds: req.params.hasBlockIds === 'true',
        timestamp: Date.now()
      };
      FileUtils.uploadSe(mongoose, req.body, metadata).then(file => {
        res.send(file);
      });
    }
  );

  /**
   * Testing route for method FileUtils.downloadSeFiles.
   * Downloads .se files from the database as a JSON array.
   */
  router.get(
    '/downloadSe/:studentID/:gameID/:objectiveID/:hasBlockIds',
    function(req, res, next) {
      const hasBlockIds = req.params.hasBlockIds === 'true';
      FileUtils.downloadSeFiles(
        mongoose,
        req.params.studentID,
        req.params.gameID,
        req.params.objectiveID,
        hasBlockIds
      ).then(seFilesAndInfo => {
        res.send(seFilesAndInfo);
      });
    }
  );

  /**
   * Testing route for method JavaUtils.extractJson.
   * Parses a JSON string to an SE string.
   * The SE string will contain block IDs if :showId is true.
   */
  router.post('/jsonToSe/:showId', function(req, res, next) {
    const showId = req.params.showId === 'true';
    //const seStr = JavaUtils.extractJson(req.body, showId);
    //res.send(seStr);
  });

  app.use('/games', router);
};

GameController.createGame = (req, res, next) => {
  res.send('Try to create a game.');
};

GameController.updateGameSE = (req, res, next) => {
  var ret = req.body;

  let properties = {
    gameID: req.params.gameID,
    updatedContent: ret.extractedJSON
  };
  GameService.updateGame(properties);
  res.send('Game ID: ' + req.params.gameID + ' , Updated');
};

GameController.updateGameSEInMemory = (req, res, next) => {
  // res.send("POST successful!");
  /*
  let properties = {
    gameID: req.params.gameID
  };
  */
  // GameService.updateGame(properties);
  var ret = req.body;
  // console.log(ret.extractedJSON);
  // console.log("TEST");
  // console.log(ret);

  let properties = {
    gameID: req.params.gameID,
    updatedContent: ret.extractedJSON
  };
  // GameService.updateGame(req.params.gameID);
  GameService.updateGame(properties);

  // res.send("Game ID: " + req.params.gameID + " , Filename: " + filename["originalname"]);
  // res.send(req.params.gameID + "POST successful!");
  res.send('Successful!');
};

GameController.fetchGame = (req, res, next) => {
  GameService.fetchGame(req.params.gameID)
    .then(game => res.send(game))
    .catch(err => next(err));
};

GameController.linkGameWithObjective = (req, res, next) => {
  let properties = {
    gameID: req.params.gameID,
    objectiveID: req.params.objectiveID
  };

  GameService.linkObjective(properties)
    .then(progresses =>
      res.send(
        'Game ' + req.params.gameID + ' linked with ' + req.params.objectiveID
      )
    )
    .catch(err => next(err));
  // console.log(req.params)
  console.log(
    'Game',
    req.params.gameID,
    'linked with ',
    req.params.objectiveID
  );
};

GameController.submitAndProcess = (req, res, next) => {
  let properties = {
    gameID: req.params.gameID,
    studentID: req.params.studentID,
    jsonString: req.body,
    objectiveID: req.params.objectiveID
  };
  // console.log("Parsing Game:"+ req.params.gameID + " for student " + req.params.studentID);

  // Store game files - yli 12/2018
  // Uploads .json file to database
  const metadata = {
    studentID: req.params.studentID,
    gameID: req.params.gameID,
    objectiveID: req.params.objectiveID,
    timestamp: Date.now()
  };
  FileUtils.uploadJson(mongoose, req.body, metadata);
  // Converts JSON to SE with block IDs
  //const seStrWithIds = JavaUtils.extractJson(req.body, true);
  // Uploads .se files to the database
  const metadata1 = {
    studentID: metadata.studentID,
    gameID: metadata.gameID,
    objectiveID: metadata.objectiveID,
    timestamp: metadata.timestamp,
    hasBlockIds: true
  };
  //FileUtils.uploadSe(mongoose, seStrWithIds, metadata1);

  // Load game into in-memory game structure
  const gameObject = GameService.refreshGame(properties);
  //console.log('game obj');
  console.log(gameObject);
  GameService.submitSprite(properties, gameObject)
    .then(progresses => {
      console.log('Game', req.params.gameID, 'uploaded');
    })

    // Hinting flow - yli 12/2018
    .then(() => {
      // Converts JSON to SE without block IDs
      //const seStr = JavaUtils.extractJson(req.body, false);
      // Uploads .se files to the database
      const metadata2 = {
        studentID: metadata.studentID,
        gameID: metadata.gameID,
        objectiveID: metadata.objectiveID,
        timestamp: metadata.timestamp,
        hasBlockIds: false
      };
      //return FileUtils.uploadSe(mongoose, seStr, metadata2);
    })
    // Then downloads all .se files from database
    .then(file => {
      return FileUtils.downloadSeFiles(
        mongoose,
        req.params.studentID,
        req.params.gameID,
        req.params.objectiveID,
        false
      );
    });
  // Then sends a request to the hinting system to get hints.
  /*.then(seFilesAndInfo => {
      console.log(seFilesAndInfo);
      return request({
        method: 'POST',
        uri: 'http://localhost:5000/get_hints',
        body: seFilesAndInfo,
        json: true
      });
    })
    // After receiving the hints, sends them to scratch.
    .then(hintRes => {
      // Mock hint response in the next 2 lines
      // let nextAutoHintTime = Date.now() + 5000;
      // res.send('{"hints": ["wait:elapsed:from:", "randomFrom:to:"], "nextAutoHintTime": ' + nextAutoHintTime + '}');
      console.log(hintRes);
      res.send(hintRes);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });*/
};

GameController.searchSubmitAndProcess = (req, res, next) => {
  console.log("Processing Student's submission" + req.params.studentID);
  console.log('Parsing Game:' + req.body);
  /* for (var val of req.body.children) {
    // console.log(val.objName)
    let properties = {
      gameID: req.params.gameID, lastUpdatedsb2FileLocation: 'in database', jsonString: req.body, sprite: val
    };

    // GameService.submitGame(properties);
    // GameService.submitGame(properties).then((game) => res.send(game)).catch((err) => next(err));
  } */
  res.send('Game submission complete');
};

// TODO
GameController.uploadProcessed = (req, res, next) => {
  console.log("Processing Student's submission" + req.params.studentID);
  console.log('Parsing Game:' + req.body);
};

module.exports = GameController;
