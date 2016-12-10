
/*eslint no-console: "allow"*/

var _ = require('lodash');
var mongoose = require('mongoose');
var glob = require('glob');
var config = require('../config/config');

mongoose.Promise = global.Promise;

var mocks = [
  { model: 'Student', data: require('./data/students.json') },
  { model: 'Teacher', data: require('./data/teachers.json') },
  { model: 'Class', data: require('./data/classes.json') },
  { model: 'Assignment', data: require('./data/assignments.json') },
  { model: 'Quest', data: require('./data/quests.json') },
];

var docs = [];

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

  return Promise.resolve();
}

function drop() {
  return Promise.all(mocks.map(mock => {
    return mongoose.model(mock.model).remove({});
  }));
}

function run() {
  return Promise.all(mocks.map(mock => {
    return Promise.all(mock.data.map(object => {
      var Model = mongoose.model(mock.model)
      var doc = Model(object)

      return doc.save({ validateBeforeSave: false })
        .then(doc => {
          docs.push(doc);
          return doc;
        })
        .catch(err => {
          console.log(`Did not insert into ${mock.model}:`, object._id);
          return;
        });
    }));
  }))
}

function validate() {
  docs.forEach(doc => {
    var err = doc.validateSync();

    if (err) {
      console.log('Failed to insert object with _id', doc._id);
      console.log(err.errors);
    }
  });
}

function exit() {
  return process.exit();
}

startup()
  // .then(drop)
  .then(run)
  .then(validate)
  .then(exit);
