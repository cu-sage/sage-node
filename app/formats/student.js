
var format = require('../utils/format');

var databaseToApiMap = {
  _id: 'id',
  name: 'name',
  avatar_url: 'avatarUrl',
  classes: 'classes'
};

var StudentFormat = format(databaseToApiMap);

module.exports = StudentFormat;
