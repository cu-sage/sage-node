
var AssessmentFormat = require('../formats/assessment');
var AssessmentService = require('../services/assessment');
var config = require('../../config/config');
var exec = require('child_process').exec;
var fs = require('fs');
var Response = require('../utils/response');

var router = require('express').Router();

function __formatAssessment(assessment) {
  console.log(assessment.mastery);
  assessment = AssessmentFormat.toApi(assessment);
  return assessment;
}

function __formatAssessments(assessments) {
  return Promise.all([assessments.map(__formatAssessment)]);
}

var AssessmentController = function(app) {
  router.get('/list', AssessmentController.findAll);
  router.get('/latest', AssessmentController.findLatest);

  router.post('/save', AssessmentController.save);

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

AssessmentController.save = (req, res, next) => {
  var assignment = req.body.assignment;
  var project = JSON.stringify(req.body.project);
  var sb2 = Buffer.from(req.body.sb2, 'base64');
  var student = req.body.student;

  fs.writeFile(config.root + '/project.sb2', sb2, 'binary', function(err) {
    if (err) {
      return next(Promise.reject(Response[500]()));
    }

    exec(`hairball -p mastery ${config.root}/project.sb2`, (error, stdout) => {
      if (error) {
        return next(Response[500]());
      }

      var results = JSON.parse(stdout.split('\n')[1].replace(/'/g, '"'));

      var properties = {
        student,
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

      AssessmentService.save(properties);
    });
  });
};

module.exports = AssessmentController;
