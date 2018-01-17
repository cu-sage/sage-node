var ResultModel = require('../models/result.js');
let ObjectiveModel = require('../models/objective.js');
let GameModel = require('../models/game.js');
var Response = require('../utils/response');
var ObjectId = require('mongoose').Types.ObjectId;
var traverse = require('traverse');

function AssessGame () {
}

AssessGame.prototype.retrieveAssessment = function (properties) {
  let {gameID, objectiveID} = properties;

  console.log("Pulling assessment statements from Game Objective " + objectiveID);
  return ObjectiveModel.findOne(
    {objectiveID},function output (err, result){
      if(err){
        return err;
      } else {
        //console.log(result.testcases)
        assessmentStatements=result.testcases
        //console.log(assessmentStatements[0])

// SAVING document for the first time, might need to make this part of a dedicated Save feature
        return ResultModel.findOneAndUpdate(
          {objectiveID, gameID},
          {$set: {assessmentStatements, assessmentResult: [],rawString: ""}}, {upsert: true}
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
  return ResultModel.findOne(
    {objectiveID},function output (err, result){
        if (result) {
        // Assign assessmentStatements to assessmentCriteria if not 'null'
        if (result.assessmentStatements) {
          assessmentCriteria=result.assessmentStatements
        }

        currGame=JSON.stringify(result.currentGame)

        // Evaluate every test Statement
        for (statementID=0; statementID<assessmentCriteria.length; statementID++) {
          if (assessmentCriteria[statementID].matcherBlockType == "matcher_be_present") {
            if (assessmentCriteria[statementID].actualBlockType == "actual_block_type") {
              testBlockType(gameID, objectiveID, assessmentCriteria, statementID, currGame);
            }
            else if ((assessmentCriteria[statementID].assertBlockType == "assert_should")) {
              testPresence(gameID, objectiveID, assessmentCriteria, statementID, currGame);
            }
          }
        }
      }
    }
  )
    //return result.assessmentResult
    .then ((assess) => {
      return Promise.resolve ({assess});
    })
    .catch ((err) => {
      return Promise.reject (err);
    });
}

var insertTestResult = function (gameID, objectiveID, resultstmt) {
  return ResultModel.findOneAndUpdate(
    {objectiveID, gameID},
    //{$set: {rawString: "aaaabbbcc"}}, {upsert: true}
    {$addToSet: {assessmentResult: resultstmt}}, {upsert: true}
    //{$set: {testResult: []}}, {upsert: true}
  ).then ((assess) => {
    return Promise.resolve ({assess});
  })
    .catch ((err) => {
      return Promise.reject (err);
    });
}

//Actual Block Type Test
var testBlockType = function (gameID, objectiveID, assessmentCriteria, statementID, currGame) {
  let actionStmt = null
  if (assessmentCriteria[statementID].actualBlockDescription == "Parallelization") {
    if (currGame.includes("whenGreenFlag")) {
      console.log("Passed Parallelization test")
      actionStmt = null
      if (assessmentCriteria[statementID].triggerBlockType == "trigger_pass") {
        actionStmt = {"type": assessmentCriteria[statementID].actionBlockType,"command": assessmentCriteria[statementID].actionBlockName}
      }
      resultStatement = ({"pass": true, "description": "Game should have parallelization", "actions": actionStmt});
      insertTestResult(gameID, objectiveID, resultStatement)
    }
    else {
      console.log("Failed Parallelization test")
      actionStmt = null
      if (assessmentCriteria[statementID].triggerBlockType == "trigger_fail") {
        actionStmt = {"type": assessmentCriteria[statementID].actionBlockType,"command": assessmentCriteria[statementID].actionBlockName}
      }
      resultStatement = ({"pass": false, "description": "Game should have parallelization", "actions": actionStmt});
      insertTestResult(gameID, objectiveID, resultStatement)
    }
  }
  else if (assessmentCriteria[statementID].actualBlockDescription == "Sensing") {
    if (currGame.includes("Sensing")) {
      console.log("Passed Sensing test")
      actionStmt = null
      if (assessmentCriteria[statementID].triggerBlockType == "trigger_pass") {
        actionStmt = {"type": assessmentCriteria[statementID].actionBlockType,"command": assessmentCriteria[statementID].actionBlockName}
      }
      resultStatement = ({"pass": true, "description": "Game should have Sensing", "actions": actionStmt});
      insertTestResult(gameID, objectiveID, resultStatement)
    }
    else {
      console.log("Failed Sensing test")
      actionStmt = null
      if (assessmentCriteria[statementID].triggerBlockType == "trigger_fail") {
        actionStmt = {"type": assessmentCriteria[statementID].actionBlockType,"command": assessmentCriteria[statementID].actionBlockName}
      }
      resultStatement = ({"pass": false, "description": "Game should have Sensing", "actions": actionStmt});
      insertTestResult(gameID, objectiveID, resultStatement)
    }
  }
}

var testPresence = function (gameID, objectiveID, assessmentCriteria, statementID, currGame) {
  let keyBlock = assessmentCriteria[statementID].actualBlockDescription
  let actionStmt = null
  testSpriteResult = "Key Block " + keyBlock + " should be present"
  if (currGame.includes(keyBlock)) {
    console.log(testSpriteResult + ":Passed")
    if (assessmentCriteria[statementID].triggerBlockType == "trigger_pass") {
      actionStmt = {"type": assessmentCriteria[statementID].actionBlockType,"command": assessmentCriteria[statementID].actionBlockName}
    }
    resultStatement = ({"pass": true, "description": testSpriteResult, "actions": actionStmt});
    insertTestResult(gameID, objectiveID, resultStatement)
  }
  else {
    console.log(testSpriteResult + ":Failed")
    if (assessmentCriteria[statementID].triggerBlockType == "trigger_fail") {
      actionStmt = {"type": assessmentCriteria[statementID].actionBlockType,"command": assessmentCriteria[statementID].actionBlockName}
    }
    resultStatement = ({"pass": false, "description": testSpriteResult, "actions": actionStmt});
    insertTestResult(gameID, objectiveID, resultStatement)
  }
}
module.exports = new AssessGame();
