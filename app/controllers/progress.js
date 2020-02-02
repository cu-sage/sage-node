var router = require('express').Router();
var ProgressService = require('../services/progress.js');
var hairball = require('../utils/hairball.js');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/submissions');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname.replace(' ', '_'));
  }
});

var upload = multer({ storage: storage });

var ProgressController = function (app) {
  router.get('/student/:studentID/assignment/:assignmentID', ProgressController.fetchAssignmentProgress);
  router.get('/student/:studentID', ProgressController.fetchStudentAllProgress);
  router.put('/student/:studentID/assignment/:assignmentID/updateJSON', ProgressController.updateJSON);
  router.post('/student/:studentID/assignment/:assignmentID', upload.single('sb2File'), ProgressController.submitAssignment);
  router.get('/assignment/:assignmentID', ProgressController.fetchProgressesOfAParticularAssignment);
  app.use('/progress', router);
};

ProgressController.fetchProgressesOfAParticularAssignment = (req, res, next) => {
  let { assignmentID } = req.params;
  let { studentIDs } = req.query;
  studentIDs = (studentIDs) ? studentIDs.split(',') : [];

  ProgressService.fetchProgressesObjectsAccordingToAssignment(assignmentID, studentIDs)
    .then((progresses) => res.send(progresses))
    .catch((err) => next(err));
};

ProgressController.fetchStudentAllProgress = (req, res, next) => {
  let { studentID } = req.params;
  let { assignmentIDs } = req.query;
  assignmentIDs = (assignmentIDs) ? assignmentIDs.split(',') : [];
  ProgressService.fetchStudentProgresses(studentID, assignmentIDs)
    .then((progresses) => res.send(progresses))
    .catch((err) => next(err));
};
ProgressController.fetchAssignmentProgress = (req, res, next) => {
  let { studentID, assignmentID } = req.params;
  ProgressService.fetch({ assignmentID, studentID })
    .then((progress) => res.send(progress))
    .catch((err) => next(err));
};

ProgressController.updateJSON = (req, res, next) => {
  let { studentID, assignmentID } = req.params;
  let { jsonString } = req.body;

  ProgressService.addNewJSON({ studentID, assignmentID, jsonString })
    .then((progress) => res.send(progress))
    .catch((err) => next(err));
};

ProgressController.submitAssignment = (req, res, next) => {
  let properties = {
    assignmentID: req.params.assignmentID,
    studentID: req.params.studentID,
    lastUpdatedsb2FileLocation: req.file.path
  };

  hairball(req.file.path)
    .then((results) => {
      properties.results = results;
      return ProgressService.submitAssignment(properties);
    })
    .then((progress) => res.send(progress))
    .catch((err) => next(err));
};

module.exports = ProgressController;
