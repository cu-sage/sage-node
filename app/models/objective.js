let mongoose = require('mongoose');
//let idValidator = require('mongoose-id-validator');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;
//let ObjectiveId = Schema.Types.objectiveID;


var ObjectiveSchema = new Schema({
  objectiveID: {
    type: ObjectId
  },
  objectiveFileLocation: {
    type: String
  },
  objectiveXML: {
    type : String
  },

}, {
  toObject: {
    virtuals: true
  },
  toJson: {
    virtuals: true
  }
});
//ObjectiveSchema.plugin(idValidator);

var Objective = mongoose.model('Objective', ObjectiveSchema);

module.exports = Objective;
