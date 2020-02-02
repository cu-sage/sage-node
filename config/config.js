var path = require('path');

var rootPath = path.normalize(path.join(__dirname, '..'));

var env = process.env.NODE_ENV || 'development';

var config = {

  local: {
    root: rootPath,
    app: {
      name: 'sage-node'
    },
    port: process.env.PORT || 8081,
    //db: 'mongodb://sage-node:sage-node@ds161210.mlab.com:61210/sage-node',
    db: 'mongodb://sage-login:sag3-login@ds133328.mlab.com:33328/sage-login'
  },

  development: {
    root: rootPath,
    app: {
      name: 'sage-node'
    },
    port: process.env.PORT || 8081,
    //db: 'mongodb://sage-node:sage-node@ds161210.mlab.com:61210/sage-node',
    db: 'mongodb://sage-login:sag3-login@ds133328.mlab.com:33328/sage-login'
  },

  test: {
    root: rootPath,
    app: {
      name: 'sage-node'
    },
    port: process.env.PORT || 8081,
    db: 'mongodb://sage-node:sage-node@ds211029.mlab.com:11029/sage-node',
    //db: 'mongodb://sage-login:sag3-login@ds133328.mlab.com:33328/sage-login'
  },

  production: {
    root: rootPath,
    app: {
      name: 'sage-node'
    },
    port: process.env.PORT || 8081,
    db: 'mongodb://localhost/sage-node-production',

  }
};

module.exports = config[env];
