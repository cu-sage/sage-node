// This model contains the same functionalities as the deprecated project model.
//
let mongoose = require('mongoose');
//let idValidator = require('mongoose-id-validator');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

var GameSchema = new Schema({
  gameID: {
    type: Number
  },

  studentID: {
    type: String
  },

  sprites : {
    type : []
  },
  gameJSON : [],
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
