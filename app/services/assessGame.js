var ResultModel = require('../models/assessmentResult.js');
let ObjectiveModel = require('../models/objective.js');
let GameModel = require('../models/game.js');
var Response = require('../utils/response');
var ObjectId = require('mongoose').Types.ObjectId;

function AssessGame () {
}

AssessGame.prototype.retrieveAssessment = function (properties) {
  let {gameID, objectiveID} = properties;

  console.log("Pulling assessment statements from Objective " + objectiveID);
  ObjectiveModel.findOne(
    {objectiveID},function output (err, result){
      if(err){
        return err;
      } else {
        //console.log(result.testcases)
        testStatements=result.testcases
        //console.log(testStatements[0])

// SAVING document for the first time, might need to make this part of a dedicated Save feature
        //let newResult = ResultModel ({gameID: 125, objectiveID: objectiveID});
/*        let newResult = ResultModel ({gameID: gameID, objectiveID: objectiveID , rawString: "test2"});
        newResult.save();*/

        return ResultModel.findOneAndUpdate(
          {objectiveID, gameID},
          {$set: {testStatements, rawString: "test1"}}, {upsert: true}
        ).then ((data) => {
          return ('Objective collection updated');})
          .catch ((err) => {
            return ("err");
          });
      }
    }
  )
}

AssessGame.prototype.evaluateGame = function (properties) {
  let {gameID, objectiveID} = properties;
  let evaluationCriterias = []
  GameModel.findOne(
    {gameID},function output (err, result) {
      if (err) {
        return err;
      } else {

        //console.log(result.sprites[0])
        return ResultModel.findOneAndUpdate(
          {objectiveID, gameID},
          {$set: {currentGame: result.sprites}}, {upsert: true}
        ).then ((data) => {
          return ('Latest game ' + gameID + ' is ready to be evaluated');})
          .catch ((err) => {
            return ("err");
          });
      }
    });

  console.log("Producing evaluation result for game " + gameID);
  ResultModel.findOne(
    {objectiveID},function output (err, result){
      if(err){
        return err;
      } else {
        //console.log(result.testcases)
        evaluationCriterias=result.testStatements
        //console.log("Result"+ result)


        for (statementID=0; statementID<evaluationCriterias.length; statementID++) {
          //console.log(evaluationCriterias[0].assertBlockType)

          if (evaluationCriterias[statementID].matcherBlockType = "matcher_be_present"){
            console.log ("Looking for block type ", evaluationCriterias[statementID].actualBlockType)
/*            var game = GameModel.findOne({ gameID });
            if (game.gameJSON[0].includes("whenGreenFlag") = true){
              console.log ("Pass Parallelization")
            }
            else {
              console.log ("Fail Parallelization")*/
          }
        }
      }
    }
  )
  return evaluationCriterias


}

module.exports = new AssessGame();
