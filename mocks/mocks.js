require('lodash');
var mongoose = require('mongoose');
var glob = require('glob');
var config = require('../config/config');

mongoose.Promise = global.Promise;

var docs = [];

function startup () {
  var options = {
    useMongoClient: true
  };
  mongoose.connect(config.db, options);
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

/* function drop () {
  return Promise.all(mocks.map(mock => {
    return mongoose.model(mock.model).remove({});
  }));
} */

function run (mocks) {
  var Schema = mongoose.Schema;
  var anySchema = new Schema({ any: Schema.Types.Mixed });
  return Promise.all(mocks.map(mock => {
    var Model = mongoose.model(mock.model, anySchema);
    return Promise.all(mock.data.map(object => {
      var doc = Model(object);

      return doc.save({ validateBeforeSave: false })
        .then(doc => {
          docs.push(doc);
          return doc;
        })
        .catch(() => {
          console.log(`Did not insert into ${mock.model}:`, object._id);
        });
    }));
  }));
}

function validate () {
  docs.forEach(doc => {
    var err = doc.validateSync();

    if (err) {
      console.log('Failed to insert object with _id', doc._id);
      console.log(err.errors);
    }
  });
}

function exit () {
  return process.exit();
}

function registerMocks () {
  return [
    { model: 'Assessment', data: require('./data/assessments.json') },
    { model: 'Assignment', data: require('./data/assignments.json') },
    { model: 'Class', data: require('./data/classes.json') },
    { model: 'Quest', data: require('./data/quests.json') },
    { model: 'Student', data: require('./data/students.json') },
    { model: 'Teacher', data: require('./data/teachers.json') }
  ];
}

startup()
  // .then(drop)
  .then(registerMocks)
  .then(run)
  .then(validate)
  .then(exit)
  .catch(err => {
    console.log(err);
  });
