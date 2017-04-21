let mongoose = require('mongoose');
//let idValidator = require('mongoose-id-validator');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

var ProgressSchema = new Schema({
  studentID: {
    type: ObjectId
  },
  assignmentID: {
    type: ObjectId
  },
  lastUpdatedsb2FileLocation : {
    type : String
  },
  progressJSON : [],
  'results' : {},
}, {
  toObject: {
    virtuals: true
  },
  toJson: {
    virtuals: true
  }
});

var Progress = mongoose.model('Progress', ProgressSchema);

module.exports = Progress;
