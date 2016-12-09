
var format = require('../utils/format');

var databaseToApiMap = {
  _id: 'id',
  teacher: 'teacher',
  assignments: 'assignments',
};

var QuestFormat = format(databaseToApiMap);

module.exports = QuestFormat;
