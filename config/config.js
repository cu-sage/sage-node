var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'sage-node'
    },
    port: process.env.PORT || 8081,
    db: 'mongodb://localhost/sage-node-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'sage-node'
    },
    port: process.env.PORT || 8081,
    db: 'mongodb://localhost/sage-node-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'sage-node'
    },
    port: process.env.PORT || 8081,
    db: 'mongodb://localhost/sage-node-production'
  }
};

module.exports = config[env];
