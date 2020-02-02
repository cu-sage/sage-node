var router = require('express').Router();
var StudentService = require('../services/student.js');
require('../services/objective.js');
require('multer');

var StudentController = function (app) {
  router.get('/:studentID', StudentController.fetchStudent);
  router.post('/updatestudent/:studentID', StudentController.updateStudent);

  app.use('/students', router);
};

StudentController.fetchStudent = (req, res, next) => {
  StudentService.fetchStudent(req.params.studentID)
    .then((student) => res.send(student))
    .catch((err) => next(err));
};

StudentController.updateStudent = (req, res, next) => {
  var ret = req.body;

  let properties = {
    studentID: req.params.studentID,
    updatedContent: ret.behaviorType
  };

  // res.send("UPDATE STUDENT");
  StudentService.updateStudent(properties);
  res.send('Student ID: ' + req.params.studentID + ' , Updated');
};

module.exports = StudentController;
