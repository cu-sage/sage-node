let mongoose = require('mongoose');
let idValidator = require('mongoose-id-validator');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

var QuestSchema = new Schema({
  teacher: {
    type: ObjectId,
    ref: 'Teacher',
    required: true
  }
});

QuestSchema.plugin(idValidator);

module.exports = mongoose.model('Quest', QuestSchema);
