
var AssessmentFormat = require('../formats/assessment');
var AssessmentService = require('../services/assessment');
var ClassService = require('../services/class');
var fs = require('fs');
var hairball = require('../utils/hairball');
var Response = require('../utils/response');
var StudentService = require('../services/student');
var tmp = require('tmp');

var router = require('express').Router();

function __formatAssessment(assessment) {
  assessment = AssessmentFormat.toApi(assessment);
  return assessment;
}

function __formatAssessments(assessments) {
  return Promise.all([assessments.map(__formatAssessment)]);
}

var AssessmentController = function(app) {
  router.get('/list', AssessmentController.findAll);
  router.get('/latest', AssessmentController.findLatest);

  router.post('/update', AssessmentController.update);

  app.use('/assessments', router);
};

AssessmentController.findAll = (req, res, next) => {
  return AssessmentService.findAll()
    .then(__formatAssessments)
    .then(assessments => res.json(assessments))
    .catch(err => next(err));
};

AssessmentController.findLatest = (req, res, next) => {
  return AssessmentService.findLatest()
    .then(__formatAssessment)
    .then(assessments => res.json(assessments))
    .catch(next);
};

AssessmentController.update = (req, res, next) => {
  var assignment = req.body.assignment;
  var project = JSON.stringify(req.body.project);
  var sb2 = Buffer.from(req.body.sb2, 'base64');
  var studentId = req.body.student;
  var tmpFile;

  // Save project data to a temporary file
  try {
    tmpFile = tmp.fileSync({ postfix: '.sb2' });
    fs.appendFileSync(tmpFile.fd, sb2);
  }
  catch (err) {
    return next(Response[500]());
  }

  // Analyze the project and save the results
  return hairball(tmpFile.name)
    .then(results => {
      var properties = {
        student: studentId,
        assignment,
        project,
        abstraction: results['Abstraction'],
        parallelization: results['Parallelization'],
        logic: results['Logic'],
        synchronization: results['Synchronization'],
        flowControl: results['FlowControl'],
        userInteractivity: results['UserInteractivity'],
        dataRepresentation: results['DataRepresentation']
      };

      return properties;
    })
    .then(AssessmentService.update)
    .then(assessment => {
      var score = assessment.mastery;
      var oldHighscore;
      var newHighscore;
      var studentAlias;

      return StudentService.findById(studentId)
        .then(student => {
          oldHighscore = student.highscore;
          return student;
        })
        .then(() => StudentService.addScore(studentId, score))
        .then(student => {
          studentAlias = student.alias;
          newHighscore = student.highscore;

          if (newHighscore >= oldHighscore) {
            return ClassService.findByStudent(student._id)
              // Update leaderboards of classes the student is in
              .then(classes => Promise.all(classes.map(
                aClass => ClassService.updateLeaderboard(aClass._id, studentAlias, newHighscore)
              )))
              .then(() => assessment);
          }

          return assessment;
        });
    })
    .then(__formatAssessment)
    .then(assessment => res.json(assessment))
    .catch(next);
};

module.exports = AssessmentController;
