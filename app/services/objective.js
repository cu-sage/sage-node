var ObjectiveModel = require('../models/objective.js');
var ResultModel = require('../models/formativeAssessResult.js');

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
      // result.xml that contains the blocks in some format
      // future: recursively capture each assesment statement
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

Objective.prototype.submitObjective = function (properties) {

  let {objectiveID, objectiveXML} = properties;
  console.log("Processing objective for " + objectiveID);

  objectiveXML = objectiveXML.replaceAll('\\', '');

  var testObjects = [];
  var parser = new xml2js.Parser({explicitArray : false});
  parser.parseString (objectiveXML, function (err, result){
    console.log('result is ', result)
    console.log('block type is ', result.xml.block[0].$['type'], 'length: ',result.xml.block.length);
    for (i=0; i < result.xml.block.length; i++) {
      console.log(result.xml.block[i].$['type']);
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
