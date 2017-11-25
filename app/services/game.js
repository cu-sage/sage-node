let GameModel = require('../models/game.js');
let SpriteModel = require('../models/sprite.js');
var Response = require('../utils/response');
let Utilities = require ('../utils/utilities.js');
var ObjectId = require('mongoose').Types.ObjectId;

function Game () {
}

Game.prototype.fetchGame= function (gameIDs) {
	return gameIDs;
};

Game.prototype.overview = function () {
  return this.find();
};

Game.prototype.submitGame = function (properties) {
  //console.log(properties);
  let {gameID, studentID, jsonString, sprite, objectiveID} = properties;

  console.log("Updating " + sprite.objName + " sprite in game " + gameID)
  return GameModel.findOneAndUpdate(
    {gameID, studentID},
    {
      $addToSet: {sprites: sprite/*, gameJSON: jsonString*/}
    },
    {upsert:true}
  ).then ((game) => {
    return Promise.resolve ({message: 'Updated'});
  })
    .catch ((err) => {
      return Promise.reject (err);
    });
};

module.exports = new Game();
