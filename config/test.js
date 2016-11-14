global._ = require('lodash');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var chai = require('chai');
chai.use(require('chai-as-promised'));
global.expect = chai.expect;

global.sinon = require('sinon');
require('sinon-mocha').enhance(sinon);
