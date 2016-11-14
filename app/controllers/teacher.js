var router = require('express').Router();
var TeacherService = require('../services/teacher');

var TeacherController = function(app) {
  app.use('/teachers', router);
};

TeacherController.findAll = (req, res, next) => {
  return TeacherService.findAll()
    .then(teachers => res.json(teachers))
    .catch(err => next(err));
};

TeacherController.findById = (req, res, next) => {
  var teacherId = req.params.id;

  return TeacherService.findById(teacherId)
    .then(teacher => res.json(teacher))
    .catch(err => next(err));
};

TeacherController.create = (req, res, next) => {
  var properties = req.body;

  return TeacherService.create(properties)
    .then(teacher => res.json(teacher))
    .catch(err => next(err));
};

router.get('/list', TeacherController.findAll);
router.get('/:id', TeacherController.findById);
router.post('/new', TeacherController.create);

module.exports = TeacherController;
