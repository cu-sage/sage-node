var router = require('express').Router();
var ObjectiveService = require ('../services/objective.js');
var multer  = require('multer');
var storage = multer.diskStorage({
  destination (req, file, cb) {cb(null, './uploads/objectives');},
  filename (req, file, cb) {cb(null, Date.now() + file.originalname.replace(' ', '_'));}
});
var upload = multer({ storage });

var ObjectiveController = function(app) {

  router.get('/:objectiveID/result', ObjectiveController.fetchObjective);
  router.post('/post/:objectiveID', ObjectiveController.submitAndProcess);
  router.post('/:objectiveID', ObjectiveController.submitVALEObjective);
  //router.post('/post/:objectiveID', upload.single('file'), ObjectiveController.submitAndProcess);
  app.use('/objectives', router);
};


ObjectiveController.fetchObjective = (req, res, next) => {
  ObjectiveService.fetchObjective(req.params.objectiveID)
    .then((objective) => res.send(objective))
    .catch((err) => next(err));
};

ObjectiveController.submitVALEObjective = (req, res, next) => {

  console.log("Submit VALE Objective:"+ req.params.objectiveID);

  let properties = {
    objectiveID: req.params.objectiveID, objectiveXML: req.body
  };

  ObjectiveService.submitVALEObjective(properties);
  //ObjectiveService.fetchObjective({},{objectiveID: req.params.objectiveID});
  //activeObjective = ObjectiveService.fetchObjective({},{objectiveID: req.params.objectiveID});
  //console.log(activeObjective);
  //console.log(JSON.stringify(activeObjective.objectiveXML));
  res.send("Objective submission complete");
};

ObjectiveController.submitAndProcess = (req, res, next) => {

  console.log("Submit Objective:"+ req.params.objectiveID);

  let properties = {
    objectiveID: req.params.objectiveID, objectiveXML: req.body
  };

  ObjectiveService.submitObjective(properties);
  //ObjectiveService.fetchObjective({},{objectiveID: req.params.objectiveID});
  //activeObjective = ObjectiveService.fetchObjective({},{objectiveID: req.params.objectiveID});
  //console.log(activeObjective);
  //console.log(JSON.stringify(activeObjective.objectiveXML));
  res.send("Objective submission complete");
};

module.exports = ObjectiveController;
