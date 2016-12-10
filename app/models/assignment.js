let mongoose = require('mongoose');
let idValidator = require('mongoose-id-validator');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

var AssignmentSchema = new Schema({
  quest: {
    type: ObjectId,
    ref: 'Quest'
  },
  questSort: {
    type: Number
  },
  teacher: {
    type: ObjectId,
    ref: 'Teacher',
    required: true
  },
  xml: {
    type: String,
    required: true
  },
  pointsTotal: {
    type: Number,
    required: true
  },
  pointsUnlock: {
    type: Number
  }
});

AssignmentSchema.plugin(idValidator);

module.exports = mongoose.model('Assignment', AssignmentSchema);
