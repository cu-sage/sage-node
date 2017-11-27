var ResultModel = require('../models/result.js');
let ObjectiveModel = require('../models/objective.js');
let GameModel = require('../models/game.js');
var Response = require('../utils/response');
var ObjectId = require('mongoose').Types.ObjectId;

function AssessGame () {
}

AssessGame.prototype.retrieveAssessment = function (properties) {
  let {gameID, objectiveID} = properties;

  console.log("Pulling assessment statements from Game Objective " + objectiveID);
  ObjectiveModel.findOne(
    {objectiveID},function output (err, result){
      if(err){
        return err;
      } else {
        //console.log(result.testcases)
        assessmentStatements=result.testcases
        //console.log(assessmentStatements[0])

// SAVING document for the first time, might need to make this part of a dedicated Save feature
        //let newResult = ResultModel ({gameID: 125, objectiveID: objectiveID});
/*        let newResult = ResultModel ({gameID: gameID, objectiveID: objectiveID , rawString: "test2"});
        newResult.save();*/

        return ResultModel.findOneAndUpdate(
          {objectiveID, gameID},
          {$set: {assessmentStatements, assessmentResult: [],rawString: "test1"}}, {upsert: true}
        ).then ((data) => {
          return ('Objective collection updated');})
          .catch ((err) => {
            return ("err");
          });
      }
    }
  )
}

AssessGame.prototype.loadingGameIntoAssessmentResult = function (properties) {
  let {gameID, objectiveID} = properties;
  console.log("Loading Game " + gameID + " into Assessment");
  GameModel.findOne(
    {gameID}, function output(err, result) {
      if (err) {
        return err;
      } else {

        //console.log(result.sprites[0])
        return ResultModel.findOneAndUpdate(
          {objectiveID, gameID},
          {$set: {currentGame: result.sprites}}, {upsert: true}
        ).then((data) => {
          return ('Latest game ' + gameID + ' is ready to be evaluated');
        })
          .catch((err) => {
            return ("err");
          });
      }
    });
}

AssessGame.prototype.assessLoadedGame = function (properties) {
  let {gameID, objectiveID} = properties;
  let assessmentCriteria = []
  console.log("Producing assessment Result for Game " + gameID);
  ResultModel.findOne(
    {objectiveID},function output (err, result){
      if(err){
        return err;
      } else {
        assessmentCriteria=result.assessmentStatements
        currGame=JSON.stringify(result.currentGame)
        var resultStatementArray = []
        // Evaluate every test Statement
        for (statementID=0; statementID<assessmentCriteria.length; statementID++) {

          if (assessmentCriteria[statementID].matcherBlockType = "matcher_be_present") {
            console.log("Looking for block type ", assessmentCriteria[statementID].actualBlockDescription)

            if(assessmentCriteria[statementID].actualBlockDescription == "Parallelization") {
              if (currGame.includes("whenGreenFlagaa")) {
                resultStatementArray.push({"pass": true, "description": "Application should have parallelization",
                  "actions": null});
                //insertTestResult(gameID, objectiveID, resultStatementArray)
                return ResultModel.findOneAndUpdate(
                  {objectiveID, gameID},
                  //{$set: {rawString: "aaaab"}}, {upsert: true}
                  {$addToSet: {assessmentResult: resultStatementArray}}, {upsert: true}
                ).then ((data) => {
                  return ('Result recorded');})
                  .catch ((err) => {
                    return ("err");
                  });
              }
              else {
                resultStatementArray=({"pass": false, "description": "Application should have parallelization",
                  "actions": null});
                console.log(resultStatementArray)
                insertTestResult(gameID, objectiveID, resultStatementArray)
/*                return ResultModel.findOneAndUpdate(
                  {objectiveID, gameID},
                  //{$set: {rawString: "aaaab"}}, {upsert: true}
                  {$addToSet: {assessmentResult: resultStatementArray}}, {upsert: true}
                ).then ((data) => {
                  return ('Result recorded');})
                  .catch ((err) => {
                    return ("err");
                  });*/
              }
            }
          }
        }
      }
    }
  )
  return assessmentCriteria
}

var insertTestResult = function (gameID, objectiveID, resultstmt) {
  console.log("In insert Test "+ gameID + " obj: " + objectiveID + JSON.stringify(resultstmt))
  var r = []
  r.push = JSON.stringify(resultstmt)
  return ResultModel.findOneAndUpdate(
    {objectiveID, gameID},
    {$set: {rawString: "aaaabbbcc"}}, {upsert: true}
    //{$addToSet: {testResult: r}}, {upsert: true}
    //{$set: {testResult: []}}, {upsert: true}
  ).then ((data) => {
    return ('Result recorded');})
    .catch ((err) => {
      return ("err");
    });
}
module.exports = new AssessGame();
