let mongoose = require('mongoose');
//let idValidator = require('mongoose-id-validator');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

var AssessStatementSchema = new Schema({
  ExpectBlock: {
    type: String
  },
  actualBlockTypeName: {
    type: String
  },
  assertBlockTypeName: {
    type: String
  },

  matcherBlockTypeName: {
    type: String
  }
}, {
  toObject: {
    virtuals: true
  },
  toJson: {
    virtuals: true
  }
});
var AssessStatement = mongoose.model('AssessStatement', AssessStatementSchema);

module.exports = AssessStatement;
