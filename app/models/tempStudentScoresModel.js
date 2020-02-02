var mongoose = require("mongoose");

var tempStudentScoresModel = mongoose.model(
  "tempstudentscores",
  new mongoose.Schema({
    studentID: String,
    assignmentID: String,
    objectiveID: String,
    timestamp: String,
    newPoint: String,
    isFinal: Boolean,
    feedback: String,
    wrongState: Boolean
  })
);

module.exports = tempStudentScoresModel;
