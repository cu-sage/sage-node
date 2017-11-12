var router = require('express').Router();
var GameService = require ('../services/game.js');
var multer  = require('multer');
var storage = multer.diskStorage({
  destination (req, file, cb) {cb(null, './uploads/games');},
  filename (req, file, cb) {cb(null, Date.now() + file.originalname.replace(' ', '_'));}
});
var upload = multer({ storage });

var GameController = function(app) {

  router.get('/:gameID', GameController.fetchGame);
  router.post('/post/:gameID', upload.single('file'), GameController.submitAndProcess);
  app.use('/games', router);
};

GameController.fetchGame = (req, res, next) => {
	let {gameID} = req.params.gameID;
	res.send('Current game ID is ' + req.params.gameID + GameService.overview());
};

GameController.submitAndProcess = (req, res, next) => {

  console.log("Game uploaded");
  console.log("Parsing Game:"+ req.params.gameID);
  for (val of req.body.children) {
    //console.log(val.objName)
    let properties = {
      gameID: req.params.gameID, lastUpdatedsb2FileLocation: "in database", jsonString: req.body, sprite: val
    };

    GameService.submitGame(properties);
    //GameService.submitGame(properties).then((game) => res.send(game)).catch((err) => next(err));
  }
  res.send("Game submission complete");
};

module.exports = GameController;
