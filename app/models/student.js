let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

var StudentSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  avatarUrl: {
    type: String,
    trim: true
  },
  classes: [{
    type: ObjectId,
    ref: 'Class'
  }]
});

var Student = mongoose.model('Student', StudentSchema);

module.exports = Student;
