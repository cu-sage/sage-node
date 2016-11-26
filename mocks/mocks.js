
/*eslint no-console: "allow"*/

var _ = require('lodash');
var mongoose = require('mongoose');
var glob = require('glob');
var config = require('../config/config');

var mocks = {
  Student: require('./data/students'),
  Teacher: require('./data/teachers'),
  Class: require('./data/classes')
};

var numberOfObjectsToLoad = 0;
var numberOfObjectsLoaded = 0;

_.forOwn(mocks, (data) => {
  numberOfObjectsToLoad += data.length;
});

function startup() {
  mongoose.connect(config.db);
  var db = mongoose.connection;
  db.on('error', function () {
    throw new Error('unable to connect to database at ' + config.db);
  });

  var models = glob.sync(config.root + '/app/models/*.js');
  models.forEach(function (model) {
    require(model);
  });
}

function drop() {
  return Promise.all([
    mongoose.model('Student').remove({}).exec(),
    mongoose.model('Teacher').remove({}).exec(),
    mongoose.model('Class').remove({}).exec()
  ]);
}

function run() {
  _.forOwn(mocks, (data, model) => {
    data.forEach(object => {
      mongoose.model(model)(object).save({ validateBeforeSave: false }, (err) => {
        if (err) {
          console.log(`Did not insert object into ${model}s:`);
          console.log(object);
        }

        if (++numberOfObjectsLoaded == numberOfObjectsToLoad) {
          console.log("Done loading mocks");
          process.exit();
        }
      });
    });
  });
}

startup();

run();
// drop().then(run);
