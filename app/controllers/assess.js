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

  var criteria=[]
  console.log("Start Assessment");
  assessGameService.retrieveAssessment(properties).then((returnValue)=>
    assessGameService.loadingGameIntoAssessmentResult(properties)).then((returnValue)=>
      assessGameService.assessLoadedGame(properties))
        .then((progresses) => res.send(progresses))
        .catch ((err) => next (err));

  console.log("Assessment Completed")
};

module.exports = AssessGameController;
