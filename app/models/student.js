let mongoose = require('mongoose');
let Schema = mongoose.Schema;

var StudentSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  avatarUrl: {
    type: String
  }
});

StudentSchema.virtual('dateCreated').get(() => this._id.getTimestamp())

var Student = mongoose.model('Student', StudentSchema);

module.exports = Student;
