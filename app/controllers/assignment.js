var AssignmentFormat = require('../formats/assignment');
var AssignmentService = require('../services/assignment');
var TeacherFormat = require('../formats/teacher');

var __formatAssignment = (assignment) => {
  return assignment.populate('teacher', '_id name')
    .execPopulate()
    .then(assignment => {
      assignment = assignment.toObject();

      if (assignment.teacher) {
        assignment.teacher = TeacherFormat.toApi(assignment.teacher);
      }

      assignment = AssignmentFormat.toApi(assignment);
      return assignment;
    });
};

var __formatAssignments = (assignments) => {
  return Promise.all(assignments.map(__formatAssignment));
};

var AssignmentController = function(app) {
  var router = require('express').Router();

  router.get('/list', AssignmentController.findAll);
  router.get('/:id', AssignmentController.findById);
  router.post('/new', AssignmentController.create);
  router.post('/:id/update_xml', AssignmentController.updateXml);
  router.post('/:id/update_quest', AssignmentController.updateQuest);

  app.use('/assignments', router);
};

AssignmentController.findAll = (req, res, next) => {
  return AssignmentService.findAll()
    .then(__formatAssignments)
    .then(assignments => res.json(assignments))
    .catch(err => next(err));
};

AssignmentController.findById = (req, res, next) => {
  var assignmentId = req.params.id;

  return AssignmentService.findById(assignmentId)
    .then(__formatAssignment)
    .then(assignment => res.json(assignment))
    .catch(err => next(err));
};

AssignmentController.create = (req, res, next) => {
  var properties = AssignmentFormat.fromApi((req.body));

  return AssignmentService.create(properties)
    .then(__formatAssignment)
    .then(assignment => res.json(assignment))
    .catch(err => next(err));
};

AssignmentController.updateXml = (req, res, next) => {
  var assignmentId = req.params.id;
  var properties = AssignmentFormat.fromApi((req.body));

  return AssignmentService.updateXml(assignmentId, properties)
    .then(__formatAssignment)
    .then(assignment => res.json(assignment))
    .catch(err => next(err));
};

AssignmentController.updateQuest = (req, res, next) => {
  var assignmentId = req.params.id;
  var properties = AssignmentFormat.fromApi((req.body));

  return AssignmentService.updateTeacher(assignmentId, properties)
    .then(__formatAssignment)
    .then(assignment => res.json(assignment))
    .catch(err => next(err));
};

module.exports = AssignmentController;
