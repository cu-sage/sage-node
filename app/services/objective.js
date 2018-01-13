var ObjectiveModel = require('../models/objective.js');
var ResultModel = require('../models/result.js');
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

Objective.prototype.submitVALEObjective = function (properties) {
  function processBlock(blocks,testcasearray){
    if (blocks){

        console.log("Processing block type " + blocks.value.block.$['type'])

        actualBlockType = blocks.value.block.$['type']
        actualBlockDescription = blocks.value.block.field._
        assertBlockType = blocks.value.block.value.block.$['type']
        matcherBlockType = blocks.value.block.value.block.value.block.$['type']
        triggerBlockType = null
        actionBlockType = null
        actionBlockName = null
        if (blocks.next){

          triggerBlockType = blocks.next.block.$['type']
          actionBlockType = blocks.next.block.value.block.$['type']
          actionBlockName = blocks.next.block.value.block.field._
          assessmentStatement = {actualBlockType, actualBlockDescription, assertBlockType, matcherBlockType, triggerBlockType, actionBlockType,actionBlockName}
          testcasearray.push(assessmentStatement)
          processNextBlock(blocks.next.block,testcasearray,actualBlockType,actualBlockDescription,assertBlockType,matcherBlockType)
          return testcasearray
        }

        assessmentStatement = {actualBlockType, actualBlockDescription, assertBlockType, matcherBlockType, triggerBlockType, actionBlockType,actionBlockName}
        testcasearray.push(assessmentStatement)
        return testcasearray
    }
  }

  function processNextBlock(nextblock,testcasearray,actualBlockType,actualBlockDescription,assertBlockType,matcherBlockType){
      if (nextblock.next){
        console.log("in next block" + nextblock.value.block.field._)
        triggerBlockType = nextblock.next.block.$['type']
        actionBlockType = nextblock.next.block.value.block.$['type']
        actionBlockName = nextblock.next.block.value.block.field._
        assessmentStatement = {actualBlockType, actualBlockDescription, assertBlockType, matcherBlockType, triggerBlockType, actionBlockType,actionBlockName}
        testcasearray.push(assessmentStatement)
        processNextBlock(nextblock.next.block,testcasearray,actualBlockType,actualBlockDescription,assertBlockType,matcherBlockType)
      }
  }
  let {objectiveID, objectiveXML} = properties;
  console.log("Processing objective for " + objectiveID);

  objectiveXML = objectiveXML.xmlfile.replaceAll('\\', '');

  var testcases = [];
  var parser = new xml2js.Parser({explicitArray : false});
  parser.parseString (objectiveXML, function (err, result){


    for (expectBlock=0; expectBlock < result.xml.block.length; expectBlock++) {
      testcases = processBlock(result.xml.block[expectBlock],testcases)

/*      actualBlockType = result.xml.block[expectBlock].value.block.$['type']
      actualBlockDescription = result.xml.block[expectBlock].value.block.field._
      assertBlockType = result.xml.block[expectBlock].value.block.value.block.$['type']
      matcherBlockType = result.xml.block[expectBlock].value.block.value.block.value.block.$['type']
      assessmentStatement = {actualBlockType, actualBlockDescription, assertBlockType, matcherBlockType}
      testcases.push(assessmentStatement)*/
      //console.log(assessmentStatement);
    }

    console.log("Upload this testcase " + JSON.stringify(testcases))
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
    },{upsert:true}
  ).then ((data) => {
    return ('Objective collection updated');})
    .catch ((err) => {
      return ("err");
    });
};

module.exports = new Objective();
