var ObjectiveModel = require('../models/objective.js');
var ResultModel = require('../models/assessmentResult.js');
let GameModel = require('../models/game.js');

var Response = require('../utils/response');
var ObjectId = require('mongoose').Types.ObjectId;

function AssessGame () {
}

AssessGame.prototype.assessGame = function (properties) {
  let {gameID, objectiveID} = properties;

  console.log("Running assessment");
  ObjectiveModel.findOne(
    {objectiveID},function output (err, result){
      if(err){
        return err;
      } else {
        //console.log(result.testcases)
        testStatements=result.testcases
        console.log(testStatements[0])

// SAVING document for the first time, might need to make this part of a dedicated Save feature
        let newResult = ResultModel ({gameID: gameID, objectiveID: objectiveID });
        newResult.save();

        ResultModel.findOneAndUpdate(
          {objectiveID, gameID},
          {$set: { "rawString": testStatements[0]}}, {$addToSet: testStatements}, {upsert: true}
        )


        ResultModel.findOneAndUpdate(
          {objectiveID, gameID},
          {$set: { "rawString": testStatements[0], "testStatements": testStatements}}, {upsert: true}
        )
        //console.log(testStatements)
        return result.testStatements
      }
    }
  )
  //console.log(currentObjective.objectiveXML)
  /*        if (matcherBlockType = "matcher_be_present"){
            console.log ("Looking for block type ", actualBlockDescription)
            var game = GameModel.findOne({ gameID });
            if (game.gameJSON[0].includes("whenGreenFlag") = true){
              console.log ("Pass Parallelization")
            }
            else {
              console.log ("Fail Parallelization")
            }

          }*/
}

module.exports = new AssessGame();
