var fs = require('fs');

let copyFile = (source, target) =>  {

  let p = new Promise ((resolve, reject) => {

    var rd = fs.createReadStream(source);
    rd.on('error', function(err) {
      reject (err);
    });

    var wr = fs.createWriteStream(target);
    wr.on('error', function(err) {
      reject (err);
    });
    wr.on('close', function(ex) {
      resolve(target);
    });
    rd.pipe(wr);
  });

  return p;
};

module.exports = {copyFile};