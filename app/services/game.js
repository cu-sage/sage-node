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

  console.log("Game Service: " + sprite.objName)
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

  /*return GameModel.findOneAndUpdate(
    {gameID},
    {
      $set: {lastUpdatedsb2FileLocation: "test", gameJson: "test", studentID},
      $addToSet: {sprites: sprite/!*, gameJSON: jsonString*!/}
    },
    {upsert:true}, function (err, doc){
      if(err) return "error";
      return "successfully saved";
    }
  )*/
    /*.then ((data) => {
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
