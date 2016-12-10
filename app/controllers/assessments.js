var router = require('express').Router();
var parseString = require('xml2js').parseString;
// var AssessmentService = require('../services/assessment');

var AssessmentController = function(app) {
  app.use('/assessments', router);
};

// AssessmentController.findAll = (req, res, next) => {
//   return AssessmentService.findAll()
//     .then(assessments => res.json(assessments))
//     .catch(err => next(err));
// };

// AssessmentController.findById = (req, res, next) => {
//   var assessmentId = req.params.id;

//   return AssessmentService.findById(assessmentId)
//     .then(assessment => res.json(assessment))
//     .catch(err => next(err));
// };

// AssessmentController.create = (req, res, next) => {
//   var properties = req.body;

//   return AssessmentService.create(properties)
//     .then(assessment => res.json(assessment))
//     .catch(err => next(err));
// };

router.post('/*', (req, res, next) => {
  parseString(req.body, (err, results) => {
    if (err) {
      return Promise.reject(err);
    }
    res.json(results);
  });
});
// router.get('/list', AssessmentController.findAll);
// router.get('/:id', AssessmentController.findById);
// router.post('/new', AssessmentController.create);

module.exports = AssessmentController;
