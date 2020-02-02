let mongoose = require('mongoose');
let idValidator = require('mongoose-id-validator');
let Schema = mongoose.Schema;

var SpriteSchema = new Schema({
  Name: {
    type: String,
    required: true
  },
  Scripts: {
    type: [String],
    required: true
  }
});

SpriteSchema.virtual('NewSprite').get(function () {
  return this.Name;
  // return this.Scripts;
});

SpriteSchema.virtual('Log').get(function () {
  return this.Name;
});

SpriteSchema.plugin(idValidator);

var Sprite = mongoose.model('Sprite', SpriteSchema);
module.exports = Sprite;
