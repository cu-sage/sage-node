// This model contains the same functionalities as the deprecated project model.
//
let mongoose = require('mongoose');
//let idValidator = require('mongoose-id-validator');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

var GameSchema = new Schema({
  gameID: {
    type: ObjectId
  },
  lastUpdatedsb2FileLocation : {
    type : String
  },
  sprites : {
    type : []
  },
  gameJSON : [],
//  'results' : {},
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
