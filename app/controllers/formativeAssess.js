var router = require('express').Router();
//var ObjectiveService = require ('../services/objective.js');
var multer  = require('multer');
var storage = multer.diskStorage({
  destination (req, file, cb) {cb(null, './uploads/objectives');},
  filename (req, file, cb) {cb(null, Date.now() + file.originalname.replace(' ', '_'));}
});
var upload = multer({ storage });

var FormativeAssessController = function(app) {

  //router.get('/:objectiveID', FormativeAssessController.fetchObjective);
  //router.post('/post/:objectiveID', FormativeAssessController.submitAndProcess);
  //router.post('/post/:objectiveID', upload.single('file'), ObjectiveController.submitAndProcess);
  //app.use('/objectives', router);
};


FormativeAssessController.fetchObjective = (req, res, next) => {
  ObjectiveService.fetchObjective(req.params.objectiveID)
    .then((objective) => res.send(objective))
    .catch((err) => next(err));
};

FormativeAssessController.submitAndProcess = (req, res, next) => {

  console.log("Submit Objective:"+ req.params.objectiveID);

  let properties = {
    objectiveID: req.params.objectiveID, objectiveXML: req.body
  };

/*  ObjectiveService.submitObjective(properties);
  //ObjectiveService.fetchObjective({},{objectiveID: req.params.objectiveID});
  //activeObjective = ObjectiveService.fetchObjective({},{objectiveID: req.params.objectiveID});
  //console.log(activeObjective);
  //console.log(JSON.stringify(activeObjective.objectiveXML));
  res.send("Objective submission complete");*/
};

module.exports = FormativeAssessController;
