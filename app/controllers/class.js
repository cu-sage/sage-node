var ClassService = require('../services/class');
var ClassFormat = require('../formats/class');
var StudentFormat = require('../formats/student');
var TeacherFormat = require('../formats/teacher');

var router = require('express').Router();

// 'class' is a reserved word, so use aClass instead

var __formatClass = aClass => {
  return aClass
    .populate('students', '_id name')
    .populate('teacher', '_id name')
    .execPopulate()
    .then(aClass => {
      aClass = aClass.toObject();

      aClass.students = StudentFormat.toApi(aClass.students);

      if (aClass.teacher) {
        aClass.teacher = TeacherFormat.toApi(aClass.teacher);
      }

      aClass = ClassFormat.toApi(aClass);
      return aClass;
    });
};

var __formatClasses = classes => {
  return Promise.all(classes.map(__formatClass));
};

var ClassController = function(app) {
  app.use('/classes', router);
};

ClassController.findAll = (req, res, next) => {
  return ClassService.findAll()
    .then(__formatClasses)
    .then(classes => res.json(classes))
    .catch(err => next(err));
};

ClassController.findById = (req, res, next) => {
  var classId = req.params.id;

  return ClassService.findById(classId)
    .then(__formatClass)
    .then(aClass => res.json(aClass))
    .catch(err => next(err));
};

ClassController.create = (req, res, next) => {
  var properties = ClassFormat.fromApi(req.body);

  return ClassService.create(properties)
    .then(__formatClass)
    .then(aClass => res.json(aClass))
    .catch(err => next(err));
};

ClassController.updateTeacher = (req, res, next) => {
  var classId = req.params.id;
  var teacherId = req.body.teacher;

  return ClassService.updateTeacher(classId, teacherId)
    .then(__formatClass)
    .then(aClass => res.json(aClass))
    .catch(err => next(err));
};

ClassController.removeTeacher = (req, res, next) => {
  var classId = req.params.id;

  return ClassService.removeTeacher(classId)
    .then(__formatClass)
    .then(aClass => res.json(aClass))
    .catch(err => next(err));
};

ClassController.addStudent = (req, res, next) => {
  var classId = req.params.id;
  var studentIdToAdd = req.body.student;

  return ClassService.addStudent(classId, studentIdToAdd)
    .then(__formatClass)
    .then(aClass => res.json(aClass))
    .catch(err => next(err));
};

ClassController.removeStudent = (req, res, next) => {
  var classId = req.params.id;
  var studentIdToRemove = req.body.student;

  return ClassService.removeStudent(classId, studentIdToRemove)
    .then(__formatClass)
    .then(aClass => res.json(aClass))
    .catch(err => next(err));
};

router.get('/list', ClassController.findAll);
router.get('/:id', ClassController.findById);
router.post('/new', ClassController.create);
router.post('/:id/update_teacher', ClassController.updateTeacher);
router.post('/:id/remove_teacher', ClassController.removeTeacher);
router.post('/:id/add_student', ClassController.addStudent);
router.post('/:id/remove_student', ClassController.removeStudent);

module.exports = ClassController;
