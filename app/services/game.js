let GameModel = require('../models/game.js');
require('../models/sprite.js');
require('../utils/response');
require('../utils/utilities.js');
require('mongoose');

function Game () {
}

Game.prototype.fetchGame = function (gameID) {
  var game = GameModel.findOne({ gameID });
  return game;
};

Game.prototype.overview = function () {
  return this.find();
};

Game.prototype.updateGame = function (properties) {
  let { gameID, updatedContent } = properties;
  var myquery = { 'gameID': gameID };
  GameModel.findOneAndUpdate(
    myquery,
    {
      $push: {
        extractedGameJSON: updatedContent
      }
    },
    { upsert: true },
    function (err, doc) {
      if (err) { throw err; } else { console.log('Updated'); }
    }
  );
  return gameID;
};

Game.prototype.refreshGame = function (properties) {
  let { gameID, studentID, jsonString } = properties;
  console.log('refreshing game ' + gameID + ' for ' + studentID);

  jsonString = JSON.stringify(jsonString);

  // console.log(jsonString)
  // Re-formatting information coming in via bodyparser as urlencoder
  let jsonGame = jsonString.replace(/\\n/g, '');
  jsonGame = jsonGame.replace(/\\t/g, '');
  jsonGame = jsonGame.replace(/\\"/g, '"');
  jsonGame = jsonGame.replace(/":"/g, '=');
  jsonGame = jsonGame.substr(2).slice(0, -2);

  // jsonGame = jsonGame.replace(/m./g,'m_')
  // console.log(jsonGame)
  jsonGame = JSON.parse('{' + jsonGame + '}');
  jsonGame.sageBlocks = {};
  jsonGame.sagePalletes = [];
  // console.log(jsonGame.scripts[0],jsonGame.scripts[1])
  // jsonScripts = JSON.parse(JSON.stringify(jsonGame.scripts))
  // console.log(jsonScripts)
  let jsonArray = [];
  jsonArray.push(jsonGame);
  return jsonArray;
};

Game.prototype.linkObjective = function (properties) {
  let { gameID, objectiveID } = properties;

  console.log('start objective linking');

  return GameModel.findOneAndUpdate(
    { gameID },
    {
      $set: {
        objectiveID }
    },
    { upsert: true }
  ).then((game) => {
    return Promise.resolve({ message: 'Objective linked' });
  })
    .catch((err) => {
      return Promise.reject(err);
    });
};

Game.prototype.submitSprite = function (properties, sprite) {
  // console.log(properties);
  let { gameID, studentID } = properties;

  // console.log(sprite);
  console.log('Updating ' + sprite[0].objName + ' sprite in game ' + gameID);

  return GameModel.findOneAndUpdate(
    { gameID, studentID },
    {
      /*      $set: {
      sprites: [],gameJSON: []
      }, */
      $set: {
        sprites: sprite, gameJSON: [] }
    },
    { upsert: true }
  ).then((game) => {
    return Promise.resolve({ message: 'Updated' });
  })
    .catch((err) => {
      return Promise.reject(err);
    });
};

module.exports = new Game();
