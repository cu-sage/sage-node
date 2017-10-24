
var Student = require('../models/student');
var Response = require('../utils/response');
var generateSillyName = require('sillyname');

var ObjectId = require('mongoose').Types.ObjectId;

var __rejectEmptyResult = student =>
  student ? student : Promise.reject(Response[404]('student not found'));

var StudentService = function() {};

StudentService.prototype.findAll = () => {
  return Student.find();
};

StudentService.prototype.findById = id => {
  if (!ObjectId.isValid(id)) {
    return Promise.reject(Response[400]('Invalid id'));
  }

  return Student.findById(id)
    .then(__rejectEmptyResult);
};

StudentService.prototype.create = properties => {
  var student = new Student(properties);
  student.alias = generateSillyName();

  return student.save();
};

StudentService.prototype.addScore = function(studentId, score) {
  return Student.findById(studentId)
    .then(student => {
      if (!student.highscore || score > student.highscore) {
        student.highscore = score;
      }

      return student.save();
    });
};

module.exports = new StudentService();
