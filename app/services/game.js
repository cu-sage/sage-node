var GameModel = require('../models/game.js');
//let AssignmentModel = require ('../models/assignment.js');
var Response = require('../utils/response');
let Utilities = require ('../utils/utilities.js');
var ObjectId = require('mongoose').Types.ObjectId;

function Games () {
}
Games.prototype.fetchGame= function (gameIDs) {
	return gameIDs;
};

Games.prototype.submitGame = function (properties) {

  let {gameID, lastUpdatedsb2FileLocation} = properties;
  console.log("Processing assessment on Game :"+ gameID + ", file name: " + lastUpdatedsb2FileLocation);

  return GameModel.findOneAndUpdate(
    {gameID},
    {
      $set : {lastUpdatedsb2FileLocation}
    }
  ).then ((game) => {
    return Promise.resolve ({message: 'Updated', lastUpdatedsb2FileLocation});
  })
    .catch ((err) => {
      return Promise.reject (err);
    });
};

module.exports = new Games();
