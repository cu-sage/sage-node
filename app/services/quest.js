
var Quest = require('../models/quest');
var Response = require('../utils/response');

var ObjectId = require('mongoose').Types.ObjectId;

var __rejectEmptyResult = quest =>
  quest ? quest : Promise.reject(Response[404]('quest not found'));

var QuestService = function() {};

QuestService.prototype.findAll = () => {
  return Quest.find();
};

QuestService.prototype.findById = questId => {
  if (!ObjectId.isValid(questId)) {
    return __rejectEmptyResult();
  }

  return Quest.findById(questId)
    .then(__rejectEmptyResult);
};

QuestService.prototype.create = (properties) => {
  var quest = new Quest(properties);

  return quest.save();
};

QuestService.prototype.addAssignment = (questId, assignmentId) => {
  if (!ObjectId.isValid(questId)) {
    return Promise.reject(Response[404]('quest not found'));
  }

  if (!ObjectId.isValid(assignmentId)) {
    return Promise.reject(Response[400]('assignment not found'));
  }

  return Quest.findById(questId)
    .then(__rejectEmptyResult)
    .then(quest => {
      quest.assignments.addToSet(assignmentId);
      return quest.save();
    });
};

QuestService.prototype.removeAssignment = (questId, assignmentId) => {
  if (!ObjectId.isValid(questId)) {
    return Promise.reject(Response[404]('quest not found'));
  }

  if (!ObjectId.isValid(assignmentId)) {
    return Promise.reject(Response[400]('invalid assignment'));
  }

  return Quest.findById(questId)
    .then(__rejectEmptyResult)
    .then(quest => {
      quest.assignments.pull(assignmentId);
      return quest.save();
    });
};

module.exports = new QuestService();
