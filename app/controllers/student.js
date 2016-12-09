
var Class = require('../models/class');
var ClassFormat = require('../formats/class');
var StudentService = require('../services/student');
var StudentFormat = require('../formats/student');

var router = require('express').Router();

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

var StudentController = function(app) {
  app.use('/students', router);
};

StudentController.findAll = (req, res, next) => {
  return StudentService.findAll()
    .then(__formatStudents)
    .then(students => res.json(students))
    .catch(err => next(err));
};

StudentController.findById = (req, res, next) => {
  var studentId = req.params.id;

  return StudentService.findById(studentId)
    .then(__formatStudent)
    .then(student => res.json(student))
    .catch(err => next(err));
};

StudentController.create = (req, res, next) => {
  var properties = StudentFormat.fromApi(req.body);

  return StudentService.create(properties)
    .then(__formatStudent)
    .then(student => res.json(student))
    .catch(err => next(err));
};

router.get('/list', StudentController.findAll);
router.get('/:id', StudentController.findById);
router.post('/new', StudentController.create);

module.exports = StudentController;
