  var router = require('express').Router();
var assessGameService = require ('../services/assessGame.js');
var ObjectiveService = require ('../services/objective.js');
var AssessGameController = function(app) {

  router.get('/game/:gameID/objective/:objectiveID', AssessGameController.assessGameAgainstObjective);
  //router.post('/post/:objectiveID', AssessGameController.submitAndProcess);
  //router.post('/post/:objectiveID', upload.single('file'), ObjectiveController.submitAndProcess);
  app.use('/assess', router);
};


AssessGameController.assessGameAgainstObjective = (req, res, next) => {
  let properties = {
    gameID: req.params.gameID, objectiveID: req.params.objectiveID
  };
  console.log("Assessing Game:" + req.params.gameID + " using Objective " + req.params.objectiveID);
  assessGameService.retrieveAssessment(properties)
  evaluateGame= assessGameService.evaluateGame(properties)
  console.log("Evaluation completed")
  res.send(evaluateGame)
};

module.exports = AssessGameController;
