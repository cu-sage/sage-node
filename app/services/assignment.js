
var Assignment = require('../models/assignment');
var Response = require('../utils/response');

var ObjectId = require('mongoose').Types.ObjectId;

var __rejectEmptyResult = assignment =>
  assignment ? assignment : Promise.reject(Response[404]('assignment not found'));

var AssignmentService = function() {};

AssignmentService.prototype.findAll = () => {
  return Assignment.find();
};

AssignmentService.prototype.findByTeacher = (teacherId) => {
  return Assignment.find({ teacher: teacherId });
};

AssignmentService.prototype.findById = assignmentId => {
  if (!ObjectId.isValid(assignmentId)) {
    return __rejectEmptyResult();
  }

  return Assignment.findById(assignmentId)
    .then(__rejectEmptyResult);
};

AssignmentService.prototype.findByQuest = questId => {
  if (!ObjectId.isValid(questId)) {
    return __rejectEmptyResult();
  }

  return Assignment.find({ quest: questId })
    .then(__rejectEmptyResult);
};

AssignmentService.prototype.create = (properties) => {
  var assignment = new Assignment(properties);

  return assignment.save();
};

AssignmentService.prototype.updateXml = (assignmentId, properties) => {
  return Assignment.findById(assignmentId)
    .then(__rejectEmptyResult)
    .then(assignment => {
      if (properties.xml) {
        assignment.xml = properties.xml;
      }
      if (properties.pointsTotal) {
        assignment.pointsTotal = properties.pointsTotal;
      }

      return assignment.save();
    });
};

AssignmentService.prototype.updateQuest = (assignmentId, properties) => {
  return Assignment.findById(assignmentId)
    .then(__rejectEmptyResult)
    .then(assignment => {
      if (properties.quest) {
        assignment.quest = properties.quest;
      }
      if (properties.questSort) {
        assignment.questSort = properties.questSort;
      }
      if (properties.pointsUnlock) {
        assignment.pointsUnlock = properties.pointsUnlock;
      }

      return assignment.save();
    });
};

module.exports = new AssignmentService();
