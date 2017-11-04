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

module.exports = new Games();


Games.prototype.submitGame = function (properties) {

  let {gameID, lastUpdatedsb2FileLocation, results} = properties;

  return GameModel.findOneAndUpdate(
    {gameID},
    {
      $set : {lastUpdatedsb2FileLocation, results}
    }
  ).then ((game) => {
    return Promise.resolve ({message: 'Updated', lastUpdatedsb2FileLocation, results});
  })
    .catch ((err) => {
      return Promise.reject (err);
    });
};
