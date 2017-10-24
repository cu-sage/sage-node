
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

module.exports = new QuestService();
