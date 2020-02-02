// This model contains the same functionalities as the deprecated project model.
//
let mongoose = require('mongoose');
// let idValidator = require('mongoose-id-validator');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

// TEST NEW SCHEMA
var GameSchema = new Schema({
  gameID: {
    type: ObjectId
  },

  studentID: {
    type: ObjectId
  },

  objectiveID: {
    type: ObjectId
  },

  Text: String,
  HintMsg: String,
  extractedGameJSON: [],
  sprites: {
    type: []
  },
  gameJSON: []
}, {
  toObject: {
    virtuals: true
  },
  toJson: {
    virtuals: true
  }
});
var Game = mongoose.model('Game', GameSchema);

module.exports = Game;
