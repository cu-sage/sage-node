var ObjectiveModel = require('../models/objective.js');

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
      console.log('result is ', result)
      console.log(result.xml.block[0])
      console.log('block type is ', result.xml.block[0].$['type']);
      // we could initiate assessment evaluation here using result
    });
  });

  return objective;

};

Objective.prototype.submitObjective = function (properties) {

  let {objectiveID, objectiveXML} = properties;
  console.log("Processing objective for " + objectiveID);

  objectiveXML = objectiveXML.replaceAll('\\', '');

  var testObjects = [];
  var parser = new xml2js.Parser();
  parser.parseString (objectiveXML, function (err, result){
    console.log('result is ', result)
    console.log('block type is ', result.xml.block[0].$['type']);
    console.log('block type is ', result.xml.block);
    testObjects = result.xml.block;
    // we could initiate assessment evaluation here using result
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
