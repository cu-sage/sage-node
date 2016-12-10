var QuestFormat = require('../formats/quest');
var QuestService = require('../services/quest');
var AssignmentService = require('../services/assignment');
var TeacherFormat = require('../formats/teacher');

var __formatQuest = (quest) => {
  return Promise.all([
    AssignmentService.findByQuest(quest._id),
    quest.populate('teacher', '_id name').execPopulate()
  ])
    .then(results => {
      var assignments = results[0];
      var quest = results[1].toObject();

      quest.assignments = assignments.map(assignment => assignment._id);
      quest.teacher = TeacherFormat.toApi(quest.teacher);

      quest = QuestFormat.toApi(quest);
      return quest;
    });

};

var __formatQuests = (quests) => {
  return Promise.all(quests.map(__formatQuest));
};

var QuestController = function(app) {
  var router = require('express').Router();

  router.get('/list', QuestController.findAll);
  router.get('/:id', QuestController.findById);
  router.post('/new', QuestController.create);
  router.post('/:id/add_assignment', QuestController.addAssignment);
  router.post('/:id/remove_assignment', QuestController.removeAssignment);

  app.use('/quests', router);
};

QuestController.findAll = (req, res, next) => {
  return QuestService.findAll()
    .then(__formatQuests)
    .then(quests => res.json(quests))
    .catch(err => next(err));
};

QuestController.findById = (req, res, next) => {
  var questId = req.params.id;

  return QuestService.findById(questId)
    .then(__formatQuest)
    .then(quest => res.json(quest))
    .catch(err => next(err));
};

QuestController.create = (req, res, next) => {
  var properties = QuestFormat.fromApi((req.body));

  return QuestService.create(properties)
    .then(__formatQuest)
    .then(quest => res.json(quest))
    .catch(err => next(err));
};

QuestController.addAssignment = (req, res, next) => {
  var questId = req.params.id;
  var assignmentId = req.body.assignment;

  return QuestService.addAssignment(questId, assignmentId)
    .then(__formatQuest)
    .then(quest => res.json(quest))
    .catch(err => next(err));
};

QuestController.removeAssignment = (req, res, next) => {
  var questId = req.params.id;
  var assignmentId = req.body.assignment;

  return QuestService.removeAssignment(questId, assignmentId)
    .then(__formatQuest)
    .then(quest => res.json(quest))
    .catch(err => next(err));
};

QuestController.updateQuest = (req, res, next) => {
  var questId = req.params.id;
  var properties = QuestFormat.fromApi((req.body));

  return QuestService.updateTeacher(questId, properties)
    .then(__formatQuest)
    .then(quest => res.json(quest))
    .catch(err => next(err));
};

module.exports = QuestController;
