var router = require("express").Router();
var hairball = require("../utils/hairball.js");
var studentSubmissionModel = require("../models/studentSubmissionModel.js");
var studentMetricsModel = require("../models/studentMetricsModel.js");
var tempStudentScoresModel = require("../models/tempStudentScoresModel.js");
require("../services/assess.js");
require("../services/objective.js");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var fs = require("fs");
//var login = mongoose.createConnection('mongodb://sage-login:sag3-login@ds133328.mlab.com:33328/sage-login')

var AssessGameController = function(app) {
  // router.get('/game/:gameID/objective/:objectiveID', AssessGameController.assessGameAgainstObjective);
  // router.get(
  //   // "/game/:gameID/objective/:objectiveID/student/:studentID",
  //   "/game/:gameID/student/:studentID",
  //   AssessGameController.assessGameAgainstObjective
  // );
  router.get(
    "/points/game/:gameID/student/:studentID",
    AssessGameController.fetchScore
  );
  // router.post('/post/:objectiveID', AssessGameController.submitAndProcess);
  // router.post('/post/:objectiveID', upload.single('file'), ObjectiveController.submitAndProcess);
  app.use("/assess", router);
};
/*AssessGameController.getFile = (req, res, next) => {
  console.log('res')
  console.log(res)
var filepath = './uploads/games/';
//var filename = req.params.gameID;
var filename = "scratchy"
console.log('downloading file with name ' + filepath + filename);
res.download(filepath + filename + '.sb2', function (err) {
  if (err) {
    console.log('error happened : ' + err);
    res.status(404).send('not found');
  }
});

};*/
function getSb2File(studentId, gameId) {
  // search sb2 file ??? storage - save a sb2 file without any association to studentId and gameId
  // mongoose.createConnection('mongodb://sage-login:sag3-login@ds133328.mlab.com:33328/sage-login');

  /*studentSubmissionModel.find({"studentID": studentId, "assignmentID" : gameId}).exec()
  .then((submissions, error) => {
    if(submissions[submissions.length-1])
    {
      console.log(submissions[submissions.length-1])
      var data = submissions[submissions.length-1]['sb2File'];
      var new_data = data.replace(/^data:image\/\w+;base64,/, "");
      var buf = new Buffer(new_data, 'base64');
    fs.writeFile(gameId+".sb2", buf, function(err, data){
      if(err) {console.log("error occurred in writing file: ", err);}
      else {console.log("successfully wrote file " + gameId + ".sb2")
      }
    });
    console.log("we returning: ", gameId+".sb2");
    return (gameId+".sb2");
}
    
    

  })
  .catch((error) => {
    console.log(error);
    //return null;
  
  });*/
  //router.get('/courses/:courseID/assessment/:aid/:sid/submitdownload"', function (req, res, next) {
  /*router.get('/assess/courses/submitdownload', function (req, res, next) {
      console.log('res')
      console.log(res)
    var filepath = './uploads/games/';
    //var filename = req.params.gameID;
    var filename = "scratchy"
    console.log('downloading file with name ' + filepath + filename);
    res.download(filepath + filename + '.sb2', function (err) {
      if (err) {
        console.log('error happened : ' + err);
        res.status(404).send('not found');
      }
    });
  });
  
  return './uploads/games/scratchy.sb2';*/
  return gameId + ".sb2";
}

function updateEveryHour(studentId, gameId) {
  // mongoose.createConnection('mongodb://sage-login:sag3-login@ds133328.mlab.com:33328/sage-login');

  //var sb2File = getSb2File(studentId, gameId);
  router.get("/assess/courses/submitdownload", function(req, res, next) {
    console.log("res");
    console.log(res);
    var filepath = "./uploads/games/";
    //var filename = req.params.gameID;
    var filename = "scratchy";
    console.log("downloading file with name " + filepath + filename);
    res.download(filepath + filename + ".sb2", function(err) {
      if (err) {
        console.log("error happened : " + err);
        res.status(404).send("not found");
      }
    });
  });
  var sb2File = gameId + ".sb2";
  var entry_games = [];
  console.log("sb2 is called: ", sb2File);
  hairball(sb2File)
    //hairball("/Users/zoeg/Downloads/serverGames/5c6f1b594b05831cb01a1c9a.sb2")
    .then(results => {
      var ct_scores = [];
      var num_count = 0;

      console.log("test test test!!!", results);
      results_string = JSON.stringify(results);
      while (num_count < 7) {
        for (var i = 0; i < results_string.length; i++) {
          if (!isNaN(results_string[i])) {
            var num_str = results_string[i];
            j = i + 1;
            while (!isNaN(results_string[j])) {
              num_str += results_string[j];
            }
            ct_scores.push(parseInt(num_str));
            num_count += 1;
          }
        }
      }
      console.log(ct_scores);
      //may want to use find one and update here
      studentMetricsModel
        .find({ studentID: studentId })
        .lean()
        .exec()
        .then(function(response, error) {
          var new_student = false;
          if (
            response.length == 0 ||
            response[response.length - 1]["enrolled"][0] == null
          ) {
            new_student = true;
            console.log("entry games");
            entry_games = [
              {
                g_id: gameId,
                g_ct: ct_scores,
                g_progress: {
                  //filling these in as zeroes because analysis is based on ct scores
                  num_obj: 0,
                  num_opoi: 0,
                  num_obj_total: 0,
                  num_opoi_total: 0
                }
              }
            ];
            console.log(entry_games);
          } else {
            console.log(response[response.length - 1]);
            entry_games = response[response.length - 1]["enrolled"][0]["games"];
            //console.log('entry games')
            //console.log(entry_games)
            var already_played = false;
            for (var i = 0; i < entry_games.length; i++) {
              if (entry_games[i]["g_id"] == gameId) {
                entry_games[i]["g_ct"] = ct_scores;
                already_played = true;
              }
            }
            if (!already_played) {
              entry_games.push({
                g_ct: ct_scores,
                g_id: gameId,
                g_progress: {
                  num_obj: 0,
                  num_opoi: 0,
                  num_obj_total: 0,
                  num_opoi_total: 0
                }
              });
              //console.log('entry games update')
              //console.log(entry_games)
            }
            //res.status(200).send(response[response.length-1]);
          }
          var metric = new studentMetricsModel({
            studentID: mongoose.Types.ObjectId(studentId),
            enrolled: [
              {
                games: entry_games
              }
            ]
          });
          console.log("metric");
          console.log(metric["enrolled"][0]["games"]);
          metric.save(function(err) {
            if (err) {
              console.log(err);
            }
          });
        })
        .catch(function(error) {
          console.log(error);
          //return res.status(500).send({error:error});
        });

      //console.log(entry_games)
    });
}

AssessGameController.assessGameAgainstObjective = (req, res, next) => {
  //mongoose.createConnection('mongodb://sage-login:sag3-login@ds133328.mlab.com:33328/sage-login');
  //router.post('/updategame/:gameID', GameController.updateGameSE);
  let properties = {
    gameID: req.params.gameID,
    // objectiveID: req.params.objectiveID,
    studentID: req.params.studentID
  };
  // my code
  console.log("id" + " " + properties.gameID);
  // end
  console.log("Start Assessment");
  // assessGameService.retrieveAssessment(properties).then((returnValue)=>
  //   assessGameService.loadingGameIntoAssessmentResult(properties)).then((returnValue)=>
  //     assessGameService.assessLoadedGame(properties))
  //       .then((progresses) => res.send(progresses))
  //       .catch ((err) => next (err));

  getSb2File(properties.studentID, properties.gameID);
  updateEveryHour(properties.studentID, properties.gameID);
  res.status("200").send({ score: 1000 });
  console.log("Assessment Completed");
};

AssessGameController.fetchScore = (req, res, next) => {
  let properties = {
    gameID: req.params.gameID,
    studentID: req.params.studentID
  };
  console.log("get score for student: " + properties.studentID);
  tempStudentScoresModel
    .find({ studentID: properties.studentID })
    .sort({ timestamp: "asc" })
    .limit(1)
    // .select("+score")
    .exec()
    .then(function(response, error) {
      if (error) {
        console.log(error);
      } else {
        console.log(response);
      }
    });
  // .sort({ timestamp: "asc" })
  // .select("+score")
  // .then(function(response, error) {
  //   if (error) {
  //     console.log(error);
  //     res.status("404").send({ error: error });
  //   } else {
  //     res.status("200").send({ score: 1500 + response.score });
  //   }
  // });
  // res.status("200").send({ score: 2000 });
  console.log("score updating completed");
};

module.exports = AssessGameController;
