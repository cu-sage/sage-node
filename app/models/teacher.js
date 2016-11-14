let mongoose = require('mongoose');
let idValidator = require('mongoose-id-validator');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

var TeacherSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  classes: [{
    type: ObjectId,
    ref: 'Class'
  }]
});

TeacherSchema.plugin(idValidator);

var Teacher = mongoose.model('Teacher', TeacherSchema);

module.exports = Teacher;
