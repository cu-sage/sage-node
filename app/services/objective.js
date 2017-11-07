var ObjectiveModel = require('../models/objective.js');
//let AssignmentModel = require ('../models/assignment.js');
var Response = require('../utils/response');
let Utilities = require ('../utils/utilities.js');
var ObjectId = require('mongoose').Types.ObjectId;

function Objectives () {
}
Objectives.prototype.fetchObjective= function (objectiveID) {
	return objectiveID;
};

Objectives.prototype.submitObjective = function (properties) {\
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

Objectives.prototype.submitGame = function (properties) {

  let {gameID, lastUpdatedsb2FileLocation} = properties;
  console.log("Processing assessment on Game :"+ gameID + ", file name: " + lastUpdatedsb2FileLocation);

  return GameModel.findOneAndUpdate(
    {gameID},
    {
      $set : {lastUpdatedsb2FileLocation}
    }
  ).then ((game) => {
    return Promise.resolve ({message: 'Updated', lastUpdatedsb2FileLocation});
  })
    .catch ((err) => {
      return Promise.reject (err);
    });
};

module.exports = new Objectives();
