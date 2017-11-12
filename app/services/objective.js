var ObjectiveModel = require('../models/objective.js');

var Response = require('../utils/response');
let Utilities = require ('../utils/utilities.js');
var ObjectId = require('mongoose').Types.ObjectId;
var xml2js = require('xml2js');

const util = require('util');

function Objective () {
}

Objective.prototype.fetchObjective= function (objectiveID) {
	return objectiveID;
};

Objective.prototype.submitObjective = function (properties) {

  let {objectiveID, objectiveXML} = properties;
  console.log("Processing objective parsing for " + objectiveID);

  var VALExml = "";

  tstXML = "<block type=\"expect\" id=\",!jjz0cm)5Q7#Okhds`]\" x=\"88\" y=\"-262\">\n" +
    "    <value name=\"NAME\">\n" +
    "      <block type=\"actual_block_type\" id=\"H?ZUEBbsp=.7tPX*tmCU\">\n" +
    "        <field name=\"NAME\">Parallelization</field>\n" +
    "        <value name=\"assert\">\n" +
    "          <block type=\"assert_should\" id=\"{*=P.@?%9RXS1wFAR8]p\">\n" +
    "            <value name=\"matcher\">\n" +
    "              <block type=\"matcher_be_present\" id=\"A^jD7kN|H@fD|-}P}pX[\"></block>\n" +
    "            </value>\n" +
    "          </block>\n" +
    "        </value>\n" +
    "      </block>\n" +
    "    </value>\n" +
    "  </block>";
  var parser = new xml2js.Parser();
  parser.parseString (tstXML, function (err, result){
    VALExml = result;
    console.log(VALExml)
  });

  VALExml = util.inspect(VALExml, false, null);
  //VALExml = JSON.stringify(util.inspect(objectiveXML, false, null));
  //console.log(JSON.stringify(util.inspect(objectiveXML, false, null)));
  //console.log("In Service: " + objectiveXML);

  //let newObjective = ObjectiveModel ({objectiveFileLocation: "a"});
  //newObjective.save();
  //console.log(newObjective.objectiveFileLocation);

  return ObjectiveModel.findOneAndUpdate(
    {objectiveID},
    {
      $set : {objectiveXML: JSON.stringify(VALExml)}
    }
  ).then ((data) => {
    return ('Objective collection updated');})
    .catch ((err) => {
      return ("err");
    });
};

module.exports = new Objective();
