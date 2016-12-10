let mongoose = require('mongoose');
let idValidator = require('mongoose-id-validator');
let Schema = mongoose.Schema;

var StudentSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  avatarUrl: {
    type: String,
    trim: true
  }
});

StudentSchema.plugin(idValidator);

var Student = mongoose.model('Student', StudentSchema);

module.exports = Student;
