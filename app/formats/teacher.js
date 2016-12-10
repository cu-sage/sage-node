
var format = require('../utils/format');

var databaseToApiMap = {
  _id: 'id',
  name: 'name',
  classes: 'classes'
};

var TeacherFormat = format(databaseToApiMap);

module.exports = TeacherFormat;
