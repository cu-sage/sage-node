
global._ = require('lodash');

var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});

var app = express();

module.exports = require('./config/express')(app, config);

/* If we are running in IIS, we did not start via "node ./bin/www".
Therefore, start listening here. */
if (process.env.hasOwnProperty("IISNODE_VERSION")) {
  var http = require('http');
  mongoose.connect(config.db);
  var db = mongoose.connection;

  db.once('open', function(){
    console.log('Connected to ' + config.db);
  });
  db.on('error', function () {
    throw new Error('unable to connect to database at ' + config.db);
  });
  app.listen(config.port, function () {
    console.log('Express server listening on port ' + config.port);
  });
}
