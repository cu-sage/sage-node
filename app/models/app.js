let mongoose = require('mongoose');
let idValidator = require('mongoose-id-validator');
let Schema = mongoose.Schema;

var AppSchema = new Schema({
  StudentID: {
    type: String,
    required: true
  },
  AssignmentID: {
    type: String,
    required: true
  },
  TimeSubmitted: {
    type: String
  },
  Sprites: {
    type: String
  },

  Original: {
    type: String
  }
});

AppSchema.virtual('NewApp').get(function () {
  return this.Sprites;
});

AppSchema.virtual('AddSprite').get(function () {
  this.Sprites = this.Sprites + 1;
  return this.Sprites;
});

AppSchema.virtual('Log').get(function () {
  return this.Sprites;
});

AppSchema.plugin(idValidator);

var App = mongoose.model('App', AppSchema);
module.exports = App;
