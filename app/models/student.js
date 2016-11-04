// Example model

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

var StudentSchema = new Schema({
  studentId: String,
  studentName: String
});

StudentSchema.virtual('dateCreated')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Student', StudentSchema);

