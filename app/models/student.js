// Example model

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

var StudentSchema = new Schema({
  name: {
    type: String,
    trim: true,
    minlength: 1
  },
  avatarUrl: {
    type: String
  }
});

StudentSchema.virtual('dateCreated')
  .get(function(){
    return this._id.getTimestamp();
  });

var Student = mongoose.model('Student', StudentSchema);
