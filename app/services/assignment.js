
var Assignment = require('../models/assignment');
var AssignmentFormat = require('../formats/assignment');
var Response = require('../utils/response');
var TeacherFormat = require('../formats/teacher');

var ObjectId = require('mongoose').Types.ObjectId;

var __rejectEmptyResult = assignment =>
  assignment ? assignment : Promise.reject(Response[404]('assignment not found'));

var __formatAssignment = (assignment) => {
  return assignment.populate('teacher', '_id name')
    .execPopulate()
    .then(assignment => {
      assignment = assignment.toObject();

      if (assignment.teacher) {
        assignment.teacher = TeacherFormat.toApi(assignment.teacher);
      }

      assignment = AssignmentFormat.toApi(assignment);
      return assignment;
    });
};

var __formatAssignments = (assignments) => {
  return Promise.all(assignments.map(__formatAssignment));
};

var AssignmentService = function() {};

AssignmentService.prototype.findAll = () => {
  return Assignment.find()
    .then(__formatAssignments);
};

AssignmentService.prototype.findByTeacher = (teacherId) => {
  return Assignment.find({ teacher: teacherId })
    .then(__formatAssignments);
};

AssignmentService.prototype.findById = id => {
  if (!ObjectId.isValid(id)) {
    return Promise.reject(Response[400]('Invalid id'));
  }

  return Assignment.findById(id)
    .then(__rejectEmptyResult)
    .then(__formatAssignment);
};

AssignmentService.prototype.create = (properties) => {
  properties = AssignmentFormat.fromApi(properties);
  var assignment = new Assignment(properties);

  return assignment.save()
    .then(__formatAssignment);
};

AssignmentService.prototype.updateTeacher = (assignmentId, teacherId) => {
  return Assignment.findById(assignmentId)
    .then(__rejectEmptyResult)
    .then(assignment => {
      assignment.teacher = teacherId;
      return assignment.save();
    })
    .then(__formatAssignment);
};

AssignmentService.prototype.updateXml = (assignmentId, xml, pointTotal) => {
  return Assignment.findById(assignmentId)
    .then(__rejectEmptyResult)
    .then(assignment => {
      assignment.xml = xml;

      if (pointTotal) {
        assignment.pointTotal = pointTotal;
      }

      return assignment.save();
    })
    .then(__formatAssignment);
};

AssignmentService.prototype.updateQuest = (assignmentId, questId, questSort, pointUnlock) => {
  return Assignment.findById(assignmentId)
    .then(__rejectEmptyResult)
    .then(assignment => {
      if (questId) {
        assignment.questId = questId;
      }
      if (questSort) {
        assignment.questSort = questSort;
      }
      if (pointUnlock) {
        assignment.pointUnlock = pointUnlock;
      }

      return assignment.save();
    })
    .then(__formatAssignment);
};

module.exports = new AssignmentService();
