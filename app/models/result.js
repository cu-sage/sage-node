let mongoose = require('mongoose');
// let idValidator = require('mongoose-id-validator');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

var ResultSchema = new Schema({
  objectiveID: {
    type: ObjectId
  },
  gameID: {
    type: ObjectId
  },
  studentID: {
    type: ObjectId
  },
  rawString: {
    type: String
  },
  currentGame: [],
  assessmentStatements: [],
  assessmentResult: []
}, {
  toObject: {
    virtuals: true
  },
  toJson: {
    virtuals: true
  }
}
);
var Result = mongoose.model('Result', ResultSchema);

module.exports = Result;
