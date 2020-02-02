var mongoose = require('mongoose');
// mongoose.connect('mongodb://sage-login:sag3-login@ds133328.mlab.com:33328/sage-login')


var studentSubmissionModel = mongoose.model('studentsubmissions', new mongoose.Schema({
    startTime: String,
    score: String,
    hintUsage: String,
    remainingSeconds: String,
    submitMsg: String,
    endTime: String,
    blocks:[],
    studentID: String,
    assignmentID: String,
    objectiveID: String,
    selfExplanation: String,
    sb2File: String,
    hairball_score: String
}));

module.exports = studentSubmissionModel;