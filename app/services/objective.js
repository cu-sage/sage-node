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
  console.log('objectiveID is ', objectiveID);
  return ObjectiveModel.findOne({ objectiveID });
};

Objective.prototype.submitObjective = function (properties) {

  let {objectiveID, objectiveXML} = properties;
  console.log("Processing objective for " + objectiveID);

  objectiveXML = objectiveXML.replaceAll('\\', '');

  var parser = new xml2js.Parser();
  parser.parseString (objectiveXML, function (err, result){
    console.log('result is ', result)
    console.log('block type is ', result.xml.block[0].$['type']);
    // we could initiate assessment evaluation here using result
  });

  return ObjectiveModel.findOneAndUpdate(
    {objectiveID},
    {
      $set: { objectiveXML: objectiveXML }
    }
  ).then ((data) => {
    return ('Objective collection updated');})
    .catch ((err) => {
      return ("err");
    });
};

module.exports = new Objective();
