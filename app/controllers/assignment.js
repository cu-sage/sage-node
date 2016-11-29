var router = require('express').Router();
var AssignmentService = require('../services/assignment');

var AssignmentController = function(app) {
  app.use('/assignments', router);
};

AssignmentController.findAll = (req, res, next) => {
  return AssignmentService.findAll()
    .then(assignments => res.json(assignments))
    .catch(err => next(err));
};

AssignmentController.findById = (req, res, next) => {
  var assignmentId = req.params.id;

  return AssignmentService.findById(assignmentId)
    .then(assignment => res.json(assignment))
    .catch(err => next(err));
};

AssignmentController.create = (req, res, next) => {
  var properties = req.body;

  return AssignmentService.create(properties)
    .then(assignment => res.json(assignment))
    .catch(err => next(err));
};

AssignmentController.updateTeacher = (req, res, next) => {
  var assignmentId = req.params.id;
  var teacherId = req.body.teacher;

  return AssignmentService.updateTeacher(assignmentId, teacherId)
    .then(assignment => res.json(assignment))
    .catch(err => next(err));
};

AssignmentController.updateXml = (req, res, next) => {
  var assignmentId = req.params.id;
  var xml = req.body.xml;
  var pointTotal = req.body.pointTotal;

  return AssignmentService.updateTeacher(assignmentId, xml, pointTotal)
    .then(assignment => res.json(assignment))
    .catch(err => next(err));
};

AssignmentController.updateQuest = (req, res, next) => {
  var assignmentId = req.params.id;
  var questId = req.body.quest_id;
  var questSort = req.body.quest_sort;
  var pointUnlock = req.body.point_unlock;

  return AssignmentService.updateTeacher(
      assignmentId, questId, questSort, pointUnlock)
    .then(assignment => res.json(assignment))
    .catch(err => next(err));
};

router.get('/list', AssignmentController.findAll);
router.get('/:id', AssignmentController.findById);
router.post('/new', AssignmentController.create);
router.post('/:id/update_teacher', AssignmentController.updateTeacher);
router.post('/:id/update_xml', AssignmentController.updateXml);
router.post('/:id/update_quest', AssignmentController.updateQuest);

module.exports = AssignmentController;
