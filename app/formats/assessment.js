
var format = require('../utils/format');

var databaseToApiMap = {
  _id: 'id',
  project: 'project',
  mastery: 'mastery',
  student: 'student',
  assignment: 'assignment',
  abstraction: 'abstraction',
  parallelization: 'parallelization',
  logic: 'logic',
  synchronization: 'synchronization',
  flowControl: 'flow_control',
  userInteractivity: 'user_interactivity',
  dataRepresentation: 'data_representation'
};

var AssessmentFormat = format(databaseToApiMap);

module.exports = AssessmentFormat;
