let mongoose = require('mongoose');
let idValidator = require('mongoose-id-validator');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

var ClassSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  teacher: {
    type: ObjectId,
    ref: 'Teacher'
  },
  students: [{
    type: ObjectId,
    ref: 'Student'
  }],
  leaderboard: [{
    studentAlias: String,
    score: Number
  }]
});

ClassSchema.plugin(idValidator);

var Class = mongoose.model('Class', ClassSchema);

module.exports = Class;
