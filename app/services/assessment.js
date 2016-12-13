
var Assessment = require('../models/assessment');
var Response = require('../utils/response');

var ObjectId = require('mongoose').Types.ObjectId;

var __rejectEmptyResult = assessment =>
  assessment ? assessment : Promise.reject(Response[404]('assessment not found'));

var AssessmentService = function() {};

AssessmentService.prototype.findAll = () => {
  return Assessment.find();
};

AssessmentService.prototype.findLatest = () => {
  return Assessment.findOne().sort({ _id: -1 })
    .then(__rejectEmptyResult);
};

AssessmentService.prototype.save = properties => {
  var student = properties.student;
  var assignment = properties.assignment;
  return Assessment.findOne({ student, assignment })
    .then(assessment => {
      if (!assessment) {
        assessment = new Assessment(properties);
      }
      else {
        _.forOwn(properties, (value, key) => {
          assessment[key] = value;
        });
      }

      return assessment.save();
    });
};

module.exports = new AssessmentService();
