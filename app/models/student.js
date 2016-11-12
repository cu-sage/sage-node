// Example model

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

var StudentSchema = new Schema({
  id: Schema.Types.ObjectId,
  name: String
});

StudentSchema.virtual('dateCreated')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Student', StudentSchema);

