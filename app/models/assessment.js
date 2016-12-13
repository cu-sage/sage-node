let mongoose = require('mongoose');
let idValidator = require('mongoose-id-validator');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

var AssessmentSchema = new Schema({
  student: {
    type: String,
    required: true
  },
  assignment: {
    type: String,
    required: true
  },
  project: {
    type: String,
    required: true
  },
  abstraction: {
    type: Number,
    required: true
  },
  parallelization: {
    type: Number,
    required: true
  },
  logic: {
    type: Number,
    required: true
  },
  synchronization: {
    type: Number,
    required: true
  },
  flowControl: {
    type: Number,
    required: true
  },
  userInteractivity: {
    type: Number,
    required: true
  },
  dataRepresentation: {
    type: Number,
    required: true
  }
}, {
  toObject: {
    virtuals: true
  },
  toJson: {
    virtuals: true
  }
});

AssessmentSchema.virtual('mastery').get(function() {
  return this.abstraction +
    this.parallelization +
    this.logic +
    this.synchronization +
    this.flowControl +
    this.userInteractivity +
    this.dataRepresentation;
});

AssessmentSchema.plugin(idValidator);

var Assessment = mongoose.model('Assessment', AssessmentSchema);

module.exports = Assessment;
