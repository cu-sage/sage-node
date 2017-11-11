var router = require('express').Router();
var ObjectiveService = require ('../services/objective.js');
var multer  = require('multer');

var storage = multer.diskStorage({
  destination (req, file, cb) {cb(null, './uploads/objectives');},
  filename (req, file, cb) {cb(null, Date.now() + file.originalname.replace(' ', '_'));}
});
var upload = multer({ storage });

var ObjectiveController = function(app) {

  router.get('/:objectiveID', ObjectiveController.fetchObjective);
  router.post('/post/:objectiveID', upload.single('file'), ObjectiveController.submitAndProcess);
  app.use('/objectives', router);
};

ObjectiveController.fetchObjective = (req, res, next) => {
	let {objectiveID} = req.params.objectiveID;
	res.send('Current objective ID is ' + req.params.objectiveID);
  //res.render('testGame',{output:req.params.gameID});
  /*
	ObjectiveService.fetchObjective({objectiveID})
	.then((games) => res.send(games))
	.catch ((err) => next (err));*/
};

ObjectiveController.submitAndProcess = (req, res, next) => {

  console.log("Objective uploaded");
  console.log("Parsing Objective:"+ req.params.objectiveID);

    let properties = {
      objectiveID: req.params.objectiveID, objectiveXML: req.body
    };

    ObjectiveService.submitObjective(properties);
  res.send("Objective submission complete");
};



module.exports = ObjectiveController;
