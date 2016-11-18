var ClassFormat = require('../formats/class');
var Student = require('../models/student');
var StudentFormat = require('../formats/student');
var Response = require('../utils/response');

var ObjectId = require('mongoose').Types.ObjectId;

var __rejectEmptyResult = student =>
  student ? student : Promise.reject(Response[404]('student not found'));

var __formatStudent = (student) => {
  student = student.toObject();

  student.classes = student.classes.map(ClassFormat.toApi);
  student = StudentFormat.toApi(student);

  return student;
};

var __formatStudents = (students) => {
  return Promise.all(students.map(__formatStudent));
};

var StudentService = function() {};

StudentService.prototype.findAll = () => {
  return Student.find()
    .populate('classes', '_id name')
    .then(__formatStudents);
};

StudentService.prototype.findById = id => {
  if (!ObjectId.isValid(id)) {
    return Promise.reject(Response[400]('Invalid id'));
  }

  return Student.findById(id)
    .populate('classes', '_id name')
    .then(__rejectEmptyResult)
    .then(__formatStudent);
};

StudentService.prototype.create = properties => {
  properties = StudentFormat.fromApi(properties);
  var student = new Student(properties);

  return student.save()
    .then(student => student.populate('classes', '_id name').execPopulate())
    .then(__formatStudent);
};

module.exports = new StudentService();
