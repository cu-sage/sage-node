
var format = require('../utils/format');

var databaseToApiMap = {
  _id: 'id',
  xml: 'xml',
  teacher: 'teacher',
  quest: 'quest_id',
  questSort: 'quest_sort',
  pointsUnlock: 'points_unlock',
  pointsTotal: 'points_total'
};

var AssignmentFormat = format(databaseToApiMap);

module.exports = AssignmentFormat;
