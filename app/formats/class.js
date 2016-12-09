
var format = require('../utils/format');

var databaseToApiMap = {
  _id: 'id',
  name: 'name',
  students: 'students_enrolled',
  teacher: 'teacher',
  teacherName: 'teacher_name',
  leaderboard: 'leadership_board'
};

var ClassFormat = format(databaseToApiMap);

module.exports = ClassFormat;
