let mongoose = require('mongoose');
let idValidator = require('mongoose-id-validator');
let Schema = mongoose.Schema;

var TeacherSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  }
});

TeacherSchema.plugin(idValidator);

var Teacher = mongoose.model('Teacher', TeacherSchema);

module.exports = Teacher;
