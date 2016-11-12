var jsen = require('jsen');
var express = require('express');
var router = express.Router();

var Student = require('mongoose').model('Student');
var mapStudent = require('../maps/student');

module.exports = function (app) {
  app.use('/students', router);
};

router.get('/list', function(req, res, next) {
  Student.find({}, (err, students) => {
    if (err) return next(err);

    students = students.map(mapStudent);
    res.json(students);
  })
})

router.get('/:id', function(req, res, next) {
  Student.findById(req.params.id, (err, student) => {
    if (err) return next(err);

    student = mapStudent(student);
    res.json(student);
  })
})

router.post('/new', function(req, res, next) {
  var validate = jsen({
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 1
      },
      avatar_url: {
        type: 'string',
        minLength: 1
      },
      required: ['name']
    }
  })

  var student = req.body

  if (!validate(student)) {
    res.send(400, 'Invalid request');
    console.log(validate.errors);
    return;
  }

  Student(student).save((err, student) => {
    console.log(student);
    student = mapStudent(student);
    res.json(student);
  })
})
