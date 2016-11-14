var router = require('express').Router();
var StudentService = require('../services/student');

var StudentController = function(app) {
  app.use('/students', router);
};

StudentController.findAll = (req, res, next) => {
  return StudentService.findAll()
    .then(students => res.json(students))
    .catch(err => next(err));
};

StudentController.findById = (req, res, next) => {
  var studentId = req.params.id;

  return StudentService.findById(studentId)
    .then(student => res.json(student))
    .catch(err => next(err));
};

StudentController.create = (req, res, next) => {
  var properties = req.body;

  return StudentService.create(properties)
    .then(student => res.json(student))
    .catch(err => next(err));
};

router.get('/list', StudentController.findAll);
router.get('/:id', StudentController.findById);
router.post('/new', StudentController.create);

module.exports = StudentController;
