var ObjectiveModel = require('../models/objective.js');
var ResultModel = require('../models/formativeAssessResult.js');
let GameModel = require('../models/game.js');

var Response = require('../utils/response');
let Utilities = require ('../utils/utilities.js');
var ObjectId = require('mongoose').Types.ObjectId;
var xml2js = require('xml2js');

const util = require('util');

String.prototype.replaceAll = function (target, replacement) {
  return this.split(target).join(replacement);
};

function Objective () {
}

Objective.prototype.fetchObjective= function (objectiveID) {

  var objective = ObjectiveModel.findOne({ objectiveID });

  objective.exec(function (error, _objective) {
    if (error)
      return console.log(error);

    var parser = new xml2js.Parser();
    parser.parseString(_objective.objectiveXML, function (err, result) {
      console.log('Evaluate game ');

      // we could initiate assessment evaluation here using result
      for (expectBlock=0; expectBlock < result.xml.block.length; expectBlock++) {
          // Read what is in Actual block
          for (actualBlock = 0; actualBlock < result.xml.block[expectBlock].value[0].block.length; actualBlock++) {

            // Process Actual Block CT Concept
            if (result.xml.block[expectBlock].value[0].block[actualBlock].$['type']=='actual_block_type') {
              //console.log("Pull field: ", result.xml.block[expectBlock].value[0].block[actualBlock]);
              var actualBlockTypeName = result.xml.block[expectBlock].value[0].block[actualBlock].field[0]._;
              var assertBlockTypeName = result.xml.block[expectBlock].value[0].block[actualBlock].value[0].block[0].$['type'];
              var matcherBlockTypeName = result.xml.block[expectBlock].value[0].block[actualBlock].value[0].block[0].value[0].block[0].$['type'];

/*              ResultModel.findOneAndUpdate(
                {objectiveID},
                {
                  $set: { objectiveXML: objectiveXML},$addToSet: {testcases: testObjects }
                }
              );*/

              console.log(actualBlockTypeName, assertBlockTypeName, matcherBlockTypeName);
            }
            //console.log(result.xml.block[expectBlock].value[0].block[actualBlock].$['type']);
        //console.log(result.xml.block[actualBlock].$['type']), result.xml.block[expectBlock].value[0].block[actualBlock].$['type']);
          }
      }
    });
  });

  return objective;

};

Objective.prototype.submitAssessmentResult = function (properties) {
  let {gameID, studentID, jsonString, objectiveID} = properties;
  //let statements = []
  console.log("Running assessment " + objectiveID + " for game " + gameID);
  ObjectiveModel.findOne(
    {objectiveID},function output (err, result){
      if(err){
        return err;
      } else {
        //console.log(result.testcases)
        statements=result.testcases
        console.log(statements[0])
        return result.testcases
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

Objective.prototype.submitVALEObjective = function (properties) {
  let {objectiveID, objectiveXML} = properties;
  console.log("Processing objective for " + objectiveID);

  objectiveXML = objectiveXML.xmlfile.replaceAll('\\', '');

  var testcases = [];
  var parser = new xml2js.Parser({explicitArray : false});
  parser.parseString (objectiveXML, function (err, result){

    for (expectBlock=0; expectBlock < result.xml.block.length; expectBlock++) {

      actualBlockType = result.xml.block[expectBlock].value.block.$['type']
      actualBlockDescription = result.xml.block[expectBlock].value.block.field._
      assertBlockType = result.xml.block[expectBlock].value.block.value.block.$['type']
      matcherBlockType = result.xml.block[expectBlock].value.block.value.block.value.block.$['type']
      assessmentStatement = {actualBlockType, actualBlockDescription, assertBlockType, matcherBlockType}
      testcases.push(assessmentStatement)
      console.log(assessmentStatement);
    }
  });

  // Clear existing XML and testcases
  ObjectiveModel.update(
    {objectiveID},
    {$set: { objectiveXML: "", testcases: []}}
  )

  return ObjectiveModel.findOneAndUpdate(
    {objectiveID},
    {
      $set: { objectiveXML, testcases}
      //,$addToSet: {testcases: assessmentStatement}
    },{upsert:true}
  ).then ((data) => {
    return ('Objective collection updated');})
    .catch ((err) => {
      return ("err");
    });
};

Objective.prototype.submitObjective = function (properties) {

  let {objectiveID, objectiveXML} = properties;
  console.log("Processing objective for " + objectiveID);

  objectiveXML = objectiveXML.replaceAll('\\', '');

  var testObjects = [];
  var parser = new xml2js.Parser({explicitArray : false});
  parser.parseString (objectiveXML, function (err, result){
    //console.log('result is ', result)
    console.log('block type is ', result.xml.block[0].$['type'], 'length: ',result.xml.block.length);
    for (i=0; i < result.xml.block.length; i++) {
      //console.log(result.xml.block[i].$['type']);
    }

    //console.log('block type is ', result.xml.block);


    //Initiate assessment evaluation here using result
    testObjects = result.xml.block;
  });

  return ObjectiveModel.findOneAndUpdate(
    {objectiveID},
    {
      $set: { objectiveXML: objectiveXML},$addToSet: {testcases: testObjects }
    }
  ).then ((data) => {
    return ('Objective collection updated');})
    .catch ((err) => {
      return ("err");
    });
};

module.exports = new Objective();
