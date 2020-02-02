var glob = require('glob');
var config = require('./config');

global._ = require('lodash');

/* Database setup */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/sage-node-test');
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});

/* Testing setup */
var chai = require('chai');
chai.use(require('chai-as-promised'));
chai.use(require('chai-things'));
global.expect = chai.expect;

global.sinon = require('sinon');
// require('sinon-mocha').enhance(sinon);
