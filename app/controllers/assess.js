  var router = require('express').Router();
var assessGameService = require ('../services/assess.js');
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

  console.log("Start Assessment");
  assessGameService.retrieveAssessment(properties)
  assessGameService.loadingGameIntoAssessmentResult(properties)
  assessGameService.assessLoadedGame(properties)
  console.log("Assessment completed")
  res.send("Assessment completed")
};

module.exports = AssessGameController;
