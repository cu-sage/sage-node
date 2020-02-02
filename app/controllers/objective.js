var router = require('express').Router();
var ObjectiveService = require('../services/objective.js');
var multer = require('multer');
var storage = multer.diskStorage({
  destination (req, file, cb) { cb(null, './uploads/objectives'); },
  filename (req, file, cb) { cb(null, Date.now() + file.originalname.replace(' ', '_')); }
});
multer({ storage });

var ObjectiveController = function (app) {
  router.get('/all', ObjectiveController.fetchAllObjectives);
  router.get('/:objectiveID/result', ObjectiveController.fetchObjective);
  router.post('/post/:objectiveID', ObjectiveController.submitAndProcess);
  router.post('/:objectiveID', ObjectiveController.submitVALEObjective);
  // router.post('/post/:objectiveID', upload.single('file'), ObjectiveController.submitAndProcess);
  router.get('/create', ObjectiveController.createObjective);
  app.use('/objectives', router);
};

ObjectiveController.fetchAllObjectives = (req, res, next) => {
  ObjectiveService.fetchAllObjectives()
    .then((objective) => res.send(objective))
    .catch((err) => next(err));
};

ObjectiveController.fetchObjective = (req, res, next) => {
  ObjectiveService.fetchObjective(req.params.objectiveID)
    .then((objective) => res.send(objective))
    .catch((err) => next(err));
};

ObjectiveController.submitVALEObjective = (req, res, next) => {
  console.log('Submit VALE Objective:' + req.params.objectiveID);
  // console.log('HELLO');
  // console.log(req);

  let properties = {
    objectiveID: req.params.objectiveID, objectiveXML: req.body.xmlfile, objectiveName: req.body.name
  };
  console.log(properties);
  ObjectiveService.submitVALEObjective(properties);
  // ObjectiveService.fetchObjective({},{objectiveID: req.params.objectiveID});
  // activeObjective = ObjectiveService.fetchObjective({},{objectiveID: req.params.objectiveID});
  // console.log(activeObjective);
  // console.log(JSON.stringify(activeObjective.objectiveXML));
  res.send('Objective submission complete');

  //testing i guess
  // res.send('Submit VALE: ' + req.params.objectiveName);

  
};

ObjectiveController.submitAndProcess = (req, res, next) => {
  console.log('Submit Objective:' + req.params.objectiveID);
  console.log('IN SUBMIT AND PROCESS');
  $log.info('HELLO BUT OVER HERE');
  let properties = {
    objectiveID: req.params.objectiveID, objectiveXML: req.body
  };

  ObjectiveService.submitObjective(properties);
  // ObjectiveService.fetchObjective({},{objectiveID: req.params.objectiveID});
  // activeObjective = ObjectiveService.fetchObjective({},{objectiveID: req.params.objectiveID});
  // console.log(activeObjective);
  // console.log(JSON.stringify(activeObjective.objectiveXML));
  // res.send('Objective submission complete');
  res.send(req);

};

ObjectiveController.createObjective = (req, res, next) => {
  ObjectiveService.createObjective()
    .then((objective) => res.send(objective))
    .catch((err) => next(err));
};

module.exports = ObjectiveController;
