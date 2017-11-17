var ObjectiveModel = require('../models/objective.js');

var Response = require('../utils/response');
let Utilities = require ('../utils/utilities.js');
var ObjectId = require('mongoose').Types.ObjectId;
var xml2js = require('xml2js');

const util = require('util');

function Objective () {
}

Objective.prototype.fetchObjective= function (objectiveID) {
	return ObjectiveModel.findOne(objectiveID);
};


Objective.prototype.submitObjective = function (properties) {

  let {objectiveID, objectiveXML} = properties;
  console.log("Processing objective parsing for " + objectiveID);
  //console.log(objectiveXML)

  //console.log(objectiveXML)
  var VALExml = "";
  var VALExml = objectiveXML.xmlfile;
  var Vxml = "";

  // Make XML input string
  //VALExml = JSON.stringify(VALExml);
  //VALExml = JSON.stringify(util.inspect(VALExml, false, null));
  VALExml = util.inspect(VALExml, false, null);

  var Vxml = VALExml.slice(1, -1);
  //console.log("Vxml0" + Vxml);
  var parser = new xml2js.Parser();
  parser.parseString (Vxml, {trim: true},function (err, result){
    Vxml = result;

  });
  //console.log(VALExml);
  //JSONxml = JSON.stringify(util.inspect(Vxml, false, null));
  JSONxml = JSON.stringify(Vxml);
  JSONxml = JSON.parse(JSONxml);
  //console.log(JSON.stringify(util.inspect(Vxml, false, null)));
  //console.log(JSONxml)
  //console.log("In Service: " + objectiveXML);

  //let newObjective = ObjectiveModel ({objectiveID});
  //newObjective.save();
  //console.log(newObjective.objectiveFileLocation);

  return ObjectiveModel.findOneAndUpdate(
    {objectiveID},
    {
      $set : {objectiveXML: JSONxml}
    }
  ).then ((data) => {
    return ('Objective collection updated');})
    .catch ((err) => {
      return ("err");
    });

};


module.exports = new Objective();
