let GameModel = require('../models/game.js');
let SpriteModel = require('../models/sprite.js');
//let AssignmentModel = require ('../models/assignment.js');
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
  let {gameID, lastUpdatedsb2FileLocation, jsonString, sprite} = properties;

  console.log("In Service: " + sprite.objName)
  return GameModel.findOneAndUpdate(
    {gameID},
      {
        $set : {lastUpdatedsb2FileLocation, gameJSON: jsonString},$addToSet: {sprites: sprite}
      }
  ).then ((data) => {
    return ('Game collection updated');})
    .catch ((err) => {
      return ("err");
    });
      /* for (val of jsonString.children) {
         return this.findOneAndUpdate(
           {"gameID": gameID},
           { $set: {lastUpdatedsb2FileLocation: "in-memory"}},
               {
                 $push : {sprites: val}
               }
         )
       }*/
};

module.exports = new Game();
