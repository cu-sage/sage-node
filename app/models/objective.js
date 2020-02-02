let mongoose = require('mongoose');
// let idValidator = require('mongoose-id-validator');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

var ObjectiveSchema = new Schema({
  objectiveID: {
    type: ObjectId
  },
  objectiveName: {
    type: String
  },
  objectiveFileLocation: {
    type: String
  },
  objectiveXML: {
    type: String
  },
  testcases: [
    {
      actualBlockType: {
        type: String
      },
      actualBlockDescription: {
        type: String
      },
      assertBlockType: {
        type: String
      },
      matcherBlockType: {
        type: String
      },
      triggerBlockType: {
        type: String
      },
      actionBlockType: {
        type: String
      },
      actionBlockName: {
        type: String
      }
    }
  ]
}, {
  toObject: {
    virtuals: true
  },
  toJson: {
    virtuals: true
  }
});
var Objective = mongoose.model('Objective', ObjectiveSchema);

module.exports = Objective;
