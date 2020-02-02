require('../formats/assignment');
var AssignmentService = require('../services/assignment');
require('../formats/teacher');
require('../utils/response.js');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/assignments');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname.replace(' ', '_'));
  }
});

var upload = multer({ storage: storage });

var AssignmentController = function(app) {
  var router = require('express').Router();

  router.post('/', upload.single('sb2File'), AssignmentController.create);
  router.put('/:id/update_xml', AssignmentController.updateXml);
  router.get('/:id/getmovefeedback', AssignmentController.getMoveFeedback);

  app.use('/assignment', router);
};

AssignmentController.create = (req, res, next) => {
  let properties = {
    assignmentID: req.body.assignmentID,
    instructorID: req.body.instructorID,
    sb2FileLocation: req.file.path
  };
  AssignmentService.create(properties)
    .then(o => res.send(o))
    .catch(err => next(err));
};

AssignmentController.updateXml = (req, res, next) => {
  let assignmentID = req.params.id;
  let assessmentXML = req.body.assessmentXML;

  return AssignmentService.updateXml(assignmentID, assessmentXML)
    .then(assignment => res.json(assignment))
    .catch(err => next(err));
};

AssignmentController.getMoveFeedback = (req, res, next) => {
  let assignmentID = req.params.id;

  return AssignmentService.findById(assignmentID)
    .then(assignment => res.json(assignment))
    .catch(err => next(err));
};

module.exports = AssignmentController;
