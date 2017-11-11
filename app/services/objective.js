var ObjectiveModel = require('../models/objective.js');
//let AssignmentModel = require ('../models/assignment.js');
var Response = require('../utils/response');
let Utilities = require ('../utils/utilities.js');
var ObjectId = require('mongoose').Types.ObjectId;


function Objective () {
}

Objective.prototype.fetchObjective= function (objectiveID) {
	return objectiveID;
};

/*
Objective.prototype.submitObjective = function (properties) {

  return properties;
};
func (a *Assessment) PostAssessment(w http.ResponseWriter, r *http.Request) {
  body, err := ioutil.ReadAll(io.LimitReader(r.Body, readLimit))
  if err != nil {
    log.Printf("Error reading request body: %s\n", err.Error())
    utils.WriteError(w, err)
    return
  }

  var testSuite models.TestSuite
  err = xml.Unmarshal(body, &testSuite)
  if err != nil {
    log.Printf("Error unmarshalling request body: %s\n", err.Error())
    utils.WriteError(w, err)
    return
  }

  vars := mux.Vars(r)
  testSuite.ID = vars["aid"]

  err = a.Repo.SaveAssessment(&testSuite)
  if err != nil {
    log.Printf("Error saving project: %s\n", err.Error())
    utils.WriteError(w, err)
    return
  }

  utils.WriteJSON(w, http.StatusAccepted, models.PostResult{ID: testSuite.ID})
}
*/
Objective.prototype.submitObjective = function (properties) {


  let {objectiveID, objectiveXML} = properties;
  console.log("Processing objective parsing");

  console.log("In Service: " + objectiveXML)

  return ObjectiveModel.findOneAndUpdate(
    {objectiveID},
    {
      $set : {objectiveXML: "init"}
    }
  ).then ((data) => {
    return ('Objective collection updated');})
    .catch ((err) => {
      return ("err");
    });
};

module.exports = new Objective();
