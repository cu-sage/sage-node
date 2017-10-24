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
    db: 'mongodb://sage-node:sage-node@ds161210.mlab.com:61210/sage-node'
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
