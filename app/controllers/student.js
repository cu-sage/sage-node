var jsen = require('jsen');
var express = require('express');
var router = express.Router();
var StudentService = require('../services/student');

module.exports = function (app) {
  app.use('/students', router);
};

router.get('/list', (req, res, next) => {
  StudentService.findAll()
    .then(students => res.json(students))
    .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
  var studentId = req.params.id;

  StudentService.findById(studentId)
    .then(student => res.json(student))
    .catch(err => next(err));
});

router.post('/new', (req, res, next) => {
  var properties = req.body;

  StudentService.create(properties)
    .then(student => res.json(student))
    .catch(err => next(err));
});
