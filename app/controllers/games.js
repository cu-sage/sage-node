var router = require('express').Router();
var GameService = require ('../services/games.js');
var hairball = require ('../utils/hairball.js');
var multer  = require('multer');
var storage = multer.diskStorage({
  destination (req, file, cb) {cb(null, './uploads/games');},
  filename (req, file, cb) {cb(null, Date.now() + file.originalname.replace(' ', '_'));}
});
var upload = multer({ storage });

var GameController = function(app) {

  router.get('/:gameID', GameController.fetchGame);
  router.post('/post/:gameID', upload.single('recfile'), GameController.submitGame);
  //router.post('/student/:studentID/assignment/:assignmentID', upload.single('sb2File'), ProgressController.submitAssignment);

  /*router.get('/student/:studentID', ProgressController.fetchStudentAllProgress);
  router.put('/student/:studentID/assignment/:assignmentID/updateJSON', ProgressController.updateJSON);
  router.get('/assignment/:assignmentID', ProgressController.fetchProgressesOfAParticularAssignment);*/
  app.use('/games', router);
};

GameController.fetchGame = (req, res, next) => {
	let {gameID} = req.params.gameID;
	res.send('test3' + req.params.gameID);
  //res.render('testGame',{output:req.params.gameID});/*
	GameService.fetchGame({gameID})
	.then((games) => res.send(games))
	.catch ((err) => next (err));
};

GameController.submitGame = (req, res, next) => {
  let properties = {
    gameID:req.params.gameID,lastUpdatedsb2FileLocation : req.recfile.path};
    res.status(204).end();
  /*
  hairball (req.recfile.path)
    .then((results) => {
      properties.results = results;
      return GameService.submitGame(properties);
    })
    .then((progress) => res.send(progress))
    .catch((err) => next(err));
    */
};



module.exports = GameController;
