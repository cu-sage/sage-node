
var _ = require('lodash');
var mongoose = require('mongoose');
var glob = require('glob');
var config = require('../config/config');

var mocks = {
  Student: require('./data/students')
}

var numberOfObjectsToLoad = 0;
var numberOfObjectsLoaded = 0;

_.forOwn(mocks, (data, model) => {
  numberOfObjectsToLoad += data.length;
})

function run() {
  mongoose.connect(config.db);
  var db = mongoose.connection;
  db.on('error', function () {
    throw new Error('unable to connect to database at ' + config.db);
  });

  var models = glob.sync(config.root + '/app/models/*.js');
  models.forEach(function (model) {
    require(model);
  });

  _.forOwn(mocks, (data, model) => {
    data.forEach(object => {
      mongoose.model(model)(object).save((err, doc) => {
        if (err) {
          console.log(`Did not insert object into ${model}s:`);
          console.log(object);
        }

        if (++numberOfObjectsLoaded == numberOfObjectsToLoad) {
          console.log("Done loading mocks");
          process.exit();
        }
      });
    })
  });
}

run();
