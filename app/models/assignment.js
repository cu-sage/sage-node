let mongoose = require('mongoose');
let idValidator = require('mongoose-id-validator');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

var AssignmentSchema = new Schema({
  assignmentID: {
    type: ObjectId,
    required: true
  },
  instructorID: {
    type: ObjectId,
    required: true
  },
  sb2FileLocation: {
    type: String,
    required: true
  },
  assessmentXML: {
    type: String
  }
});

AssignmentSchema.plugin(idValidator);

module.exports = mongoose.model('Assignment', AssignmentSchema);
