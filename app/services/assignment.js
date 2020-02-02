
var Assignment = require('../models/assignment');
var Response = require('../utils/response');

var ObjectId = require('mongoose').Types.ObjectId;

var __rejectEmptyResult = assignment =>
  assignment || Promise.reject(Response[404]('assignment not found'));

var AssignmentService = function () {};

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

  return Assignment.find({ quest: questId });
};

AssignmentService.prototype.create = (properties) => {
  return Assignment.findOne({ assignmentID: properties.assignmentID })
    .then((assignment) => {
      if (assignment) return Promise.reject(Response[400]('Already exists'));
      let newAssignment = new Assignment(properties);
      return newAssignment.save();
    }).catch((error) => {
      return Promise.reject(error);
    });
};

AssignmentService.prototype.updateXml = (assignmentID, assessmentXML) => {
  return Assignment.findOne({ assignmentID: assignmentID })
    .then(__rejectEmptyResult)
    .then((assignment) => {
      assignment.assessmentXML = assessmentXML;
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
