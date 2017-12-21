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

Game.prototype.refreshGame = function (properties) {
  let {gameID, studentID, jsonString, objectiveID} = properties;
  console.log("refreshing game " + gameID + " for " + studentID)

  jsonString = JSON.stringify(jsonString)
  console.log(jsonString)
  jsonGame = jsonString.replace(/\\n/g,"")
  jsonGame = jsonGame.replace(/\\t/g,"")
  jsonGame = jsonGame.replace(/\\"/g,'"')
  jsonGame = jsonGame.replace(/\\"/g,'"')
  jsonGame = jsonGame.replace(/":"/g,'=')
  jsonGame = jsonGame.substr(2).slice(0,-2)/*
  console.log("After replace " + jsonGame.objectName)*/
  jsonGame = JSON.parse(jsonGame)
  console.log(jsonGame)
  //jsonScripts = JSON.parse(JSON.stringify(jsonGame.scripts))
  //console.log(jsonScripts)
  return jsonGame
  //console.log("After replace " + jsonGame.objName)

};

Game.prototype.submitSprite = function (properties) {
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

var parseSB2 = function (refGame) {

  /*  Object.size = function(obj,key) {
      var size = 0, key;
      for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
      }
      return size;
    };*/

  var gameArray = {}
  //console.log(refGame)
  //console.log(Object.keys(refGame).length)
  console.log("Inside ParseSB2" + refGame[0].objName)
  /*console.log(refGame[1].objName)
  console.log(Object.size(refGame,refGame.objName))
  for (i=0; i<Object.keys(refGame).length; i++) {
    gameArray.objName = refGame[i]
  }
*/
  return gameArray
}

module.exports = new Game();
