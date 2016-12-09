var ClassService = require('../services/class');
var ClassFormat = require('../formats/class');
var TeacherService = require('../services/teacher');
var TeacherFormat = require('../formats/teacher');

var router = require('express').Router();

var __formatTeacher = teacher => {
  teacher = teacher.toObject();

  return ClassService.findByTeacher(teacher._id, '_id name')
    .then(classes => {
      teacher.classes = ClassFormat.toApi(classes);
      teacher = TeacherFormat.toApi(teacher);

      return teacher;
    });
};

var __formatTeachers = teachers => {
  return Promise.all(teachers.map(__formatTeacher));
};

var TeacherController = function(app) {
  app.use('/teachers', router);
};

TeacherController.findAll = (req, res, next) => {
  return TeacherService.findAll()
    .then(__formatTeachers)
    .then(teachers => res.json(teachers))
    .catch(err => next(err));
};

TeacherController.findById = (req, res, next) => {
  var teacherId = req.params.id;

  return TeacherService.findById(teacherId)
    .then(__formatTeacher)
    .then(teacher => res.json(teacher))
    .catch(err => next(err));
};

TeacherController.create = (req, res, next) => {
  var properties = TeacherFormat.fromApi(req.body);

  return TeacherService.create(properties)
    .then(__formatTeacher)
    .then(teacher => res.json(teacher))
    .catch(err => next(err));
};

router.get('/list', TeacherController.findAll);
router.get('/:id', TeacherController.findById);
router.post('/new', TeacherController.create);

module.exports = TeacherController;
