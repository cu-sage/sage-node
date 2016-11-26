var Class = require('../models/class');
var ClassFormat = require('../formats/class');
var Student = require('../models/student');
var StudentFormat = require('../formats/student');
var Response = require('../utils/response');

var ObjectId = require('mongoose').Types.ObjectId;

var __rejectEmptyResult = student =>
  student ? student : Promise.reject(Response[404]('student not found'));

var __formatStudent = (student) => {
  student = student.toObject();

  return Class.find({ students: student._id }, '_id name')
    .lean()
    .then(classes => {
      classes = classes.map(ClassFormat.toApi);

      student.classes = classes;
      student = StudentFormat.toApi(student);

      return student;
    });
};

var __formatStudents = (students) => {
  return Promise.all(students.map(__formatStudent));
};

var StudentService = function() {};

StudentService.prototype.findAll = () => {
  return Student.find()
    .then(__formatStudents);
};

StudentService.prototype.findById = id => {
  if (!ObjectId.isValid(id)) {
    return Promise.reject(Response[400]('Invalid id'));
  }

  return Student.findById(id)
    .then(__rejectEmptyResult)
    .then(__formatStudent);
};

StudentService.prototype.create = properties => {
  properties = StudentFormat.fromApi(properties);
  var student = new Student(properties);

  return student.save()
    .then(__formatStudent);
};

module.exports = new StudentService();
