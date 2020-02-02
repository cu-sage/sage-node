var ResultModel = require('../models/result.js');
let ObjectiveModel = require('../models/objective.js');
let GameModel = require('../models/game.js');
require('../utils/response');
require('mongoose');
require('traverse');

function AssessGame () {
}

AssessGame.prototype.retrieveAssessment = function (properties) {
  let { gameID, objectiveID, studentID } = properties;

  console.log('Pulling assessment statements from Game Objective ' + objectiveID);
  return ObjectiveModel.findOne(
    { objectiveID }, function output (err, result) {
      if (err) {
        return err;
      } else {
        // console.log(result.testcases)
        var assessmentStatements = result.testcases;
        // console.log(assessmentStatements[0])

        // SAVING document for the first time, might need to make this part of a dedicated Save feature
        return ResultModel.findOneAndUpdate(
          { objectiveID, gameID, studentID },
          { $set: { assessmentStatements, assessmentResult: [], rawString: '' } }, { upsert: true }
        ).then(() => {
          return ('Objective collection updated');
        })
          .catch((err) => {
            return err;
          });
      }
    }
  );
};

AssessGame.prototype.loadingGameIntoAssessmentResult = function (properties) {
  let { gameID, objectiveID, studentID } = properties;
  console.log('Loading Game ' + gameID + ' into Assessment');
  GameModel.findOne(
    { gameID, studentID }, function output (err, result) {
      if (err) {
        return err;
      } else {
        // console.log(result.sprites[0])
        return ResultModel.findOneAndUpdate(
          { objectiveID, gameID, studentID },
          { $set: { currentGame: result.sprites } }, { upsert: true }
        ).then((data) => {
          return ('Latest game ' + gameID + ' is ready to be evaluated');
        })
          .catch((err) => {
            return err;
          });
      }
    });
};

AssessGame.prototype.assessLoadedGame = function (properties) {
  let { gameID, objectiveID, studentID } = properties;
  let assessmentCriteria = [];
  console.log('Producing assessment Result for Game ' + gameID);
  return ResultModel.findOne(
    { gameID, objectiveID, studentID }, function output () {

      // move logic into then section
      // TODO (anyone) : remove this callback declaration
      // let assesResult = []
      // if (result) {
      //   // Assign assessmentStatements to assessmentCriteria if not 'null'
      //   if (result.assessmentStatements) {
      //     assessmentCriteria=result.assessmentStatements
      //   }
      //   // console.log(assessmentCriteria)
      //   currGame=JSON.stringify(result.currentGame)
      //   // Evaluate every test Statement
      //   console.log("------------------------------------------------")
      //   for (statementID=0; statementID<assessmentCriteria.length; statementID++) {
      //     if (assessmentCriteria[statementID].matcherBlockType == "matcher_be_present") {
      //       if (assessmentCriteria[statementID].actualBlockType == "actual_block_type") {
      //         assesResult.push(testBlockType(gameID, objectiveID, assessmentCriteria, statementID, currGame,studentID));
      //       }
      //       else if ((assessmentCriteria[statementID].assertBlockType == "assert_should")) {
      //         assesResult.push(testPresence(gameID, objectiveID, assessmentCriteria, statementID, currGame,studentID));
      //       }
      //     }
      //   }
      //   console.log("------------------------------------------------")
      // }
    })
    .then((assess) => {
      let assessResult = [];
      if (assess) {
        // Assign assessmentStatements to assessmentCriteria if not 'null'
        if (assess.assessmentStatements) {
          assessmentCriteria = assess.assessmentStatements;
        }
        // console.log(assessmentCriteria)
        var currGame = JSON.stringify(assess.currentGame);
        // Evaluate every test Statement
        console.log('------------------------------------------------');
        for (var statementID = 0; statementID < assessmentCriteria.length; statementID++) {
          if (assessmentCriteria[statementID].matcherBlockType === 'matcher_be_present') {
            if (assessmentCriteria[statementID].actualBlockType === 'actual_block_type') {
              assessResult.push(testBlockType(gameID, objectiveID, assessmentCriteria, statementID, currGame, studentID));
            } else if ((assessmentCriteria[statementID].assertBlockType === 'assert_should')) {
              assessResult.push(testPresence(gameID, objectiveID, assessmentCriteria, statementID, currGame, studentID));
            }
          }
        }
        console.log('------------------------------------------------');
      }
      console.log('------------------------------------------------');
      console.log('result length : ' + assessResult.length);
      console.log('------------------------------------------------');
      return {
        'assess': {
          'assessmentResult': assessResult
        }
      };

      // console.log("------------------------------------------------")
      // console.log("result length : "+assess.assessmentResult.length)
      // console.log("------------------------------------------------")
      // return Promise.resolve({assess})
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

var insertTestResult = function (gameID, objectiveID, resultstmt, studentID) {
  // console.log("in insertTestResult " + gameID + "obj " + objectiveID + "res " + resultstmt.pass+" stu"+studentID)
  return ResultModel.findOneAndUpdate(
    { objectiveID, gameID, studentID },
    // {$set: {rawString: "aaaabbbcc"}}, {upsert: true}
    { $addToSet: { assessmentResult: resultstmt } }, { upsert: true }
    // {$set: {testResult: []}}, {upsert: true}
  ).then((assess) => {
    return Promise.resolve({ assess });
  })
    .catch((err) => {
      return Promise.reject(err);
    });
};

// Actual Block Type Test
var testBlockType = function (gameID, objectiveID, assessmentCriteria, statementID, currGame, studentID) {
  let actionStmt = null;
  if (assessmentCriteria[statementID].actualBlockDescription === 'Parallelization') {
    var resultStatement;
    if (currGame.includes('whenGreenFlag')) {
      console.log('Passed Parallelization test');
      actionStmt = null;
      if (assessmentCriteria[statementID].triggerBlockType === 'trigger_pass') {
        actionStmt = { 'type': assessmentCriteria[statementID].actionBlockType, 'command': assessmentCriteria[statementID].actionBlockName };
      }
      resultStatement = ({ 'pass': true, 'description': 'Game should have parallelization', 'actions': actionStmt, '_id': assessmentCriteria[statementID]._id });
      insertTestResult(gameID, objectiveID, resultStatement, studentID);
      return resultStatement;
    } else {
      console.log('Failed Parallelization test');
      actionStmt = null;
      if (assessmentCriteria[statementID].triggerBlockType === 'trigger_fail') {
        actionStmt = { 'type': assessmentCriteria[statementID].actionBlockType, 'command': assessmentCriteria[statementID].actionBlockName };
      }
      resultStatement = ({ 'pass': false, 'description': 'Game should have parallelization', 'actions': actionStmt, '_id': assessmentCriteria[statementID]._id });
      console.log(resultStatement);
      insertTestResult(gameID, objectiveID, resultStatement, studentID);
      return resultStatement;
    }
  } else if (assessmentCriteria[statementID].actualBlockDescription === 'Sensing') {
    if (currGame.includes('Sensing')) {
      console.log('Passed Sensing test');
      actionStmt = null;
      if (assessmentCriteria[statementID].triggerBlockType === 'trigger_pass') {
        actionStmt = { 'type': assessmentCriteria[statementID].actionBlockType, 'command': assessmentCriteria[statementID].actionBlockName };
      }
      resultStatement = ({ 'pass': true, 'description': 'Game should have Sensing', 'actions': actionStmt, '_id': assessmentCriteria[statementID]._id });
      insertTestResult(gameID, objectiveID, resultStatement, studentID);
      return resultStatement;
    } else {
      console.log('Failed Sensing test');
      actionStmt = null;
      if (assessmentCriteria[statementID].triggerBlockType === 'trigger_fail') {
        actionStmt = { 'type': assessmentCriteria[statementID].actionBlockType, 'command': assessmentCriteria[statementID].actionBlockName };
      }
      resultStatement = ({ 'pass': false, 'description': 'Game should have Sensing', 'actions': actionStmt, '_id': assessmentCriteria[statementID]._id });
      insertTestResult(gameID, objectiveID, resultStatement, studentID);
      return resultStatement;
    }
  }
};

var testPresence = function (gameID, objectiveID, assessmentCriteria, statementID, currGame, studentID) {
  let keyBlock = assessmentCriteria[statementID].actualBlockDescription;
  let actionStmt = null;
  let testSpriteResult = 'Key Block ' + keyBlock + ' should be present';
  if (currGame.includes(keyBlock)) {
    console.log(testSpriteResult + ':Passed');
    if (assessmentCriteria[statementID].triggerBlockType === 'trigger_pass') {
      actionStmt = { 'type': assessmentCriteria[statementID].actionBlockType, 'command': assessmentCriteria[statementID].actionBlockName };
    }
    let resultStatement = ({ 'pass': true, 'description': testSpriteResult, 'actions': actionStmt, '_id': assessmentCriteria[statementID]._id });
    insertTestResult(gameID, objectiveID, resultStatement, studentID);
    return resultStatement;
  } else {
    console.log(testSpriteResult + ':Failed');
    if (assessmentCriteria[statementID].triggerBlockType === 'trigger_fail') {
      actionStmt = { 'type': assessmentCriteria[statementID].actionBlockType, 'command': assessmentCriteria[statementID].actionBlockName };
    }
    let resultStatement = ({ 'pass': false, 'description': testSpriteResult, 'actions': actionStmt, '_id': assessmentCriteria[statementID]._id });
    insertTestResult(gameID, objectiveID, resultStatement, studentID);
    return resultStatement;
  }
};
module.exports = new AssessGame();
