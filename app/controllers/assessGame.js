var router = require('express').Router();
var ObjectiveService = require ('../services/objective.js');

var AssessGameController = function(app) {

  router.get('/game/:gameID/objective/:objectiveID', AssessGameController.assessGameAgainstObjective);
  //router.post('/post/:objectiveID', AssessGameController.submitAndProcess);
  //router.post('/post/:objectiveID', upload.single('file'), ObjectiveController.submitAndProcess);
  app.use('/assessGame', router);
};


AssessGameController.assessGameAgainstObjective = (req, res, next) => {


  ObjectiveService.submitAssessmentResult(properties);


  ObjectiveService.fetchObjective(req.params.objectiveID)
    .then((objective) => res.send(objective))
    .catch((err) => next(err));
};

module.exports = AssessGameController;
