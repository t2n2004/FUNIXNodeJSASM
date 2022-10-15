const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timeLogSchema = new Schema({
  staffId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Staff'
  },
  workplace: {
    type: String,
    required: true,
  },
  startedAt: {
    type: Date,
    default: Date.now()
  },
  endedAt: {
    type: Date,
  }
});

timeLogSchema.methods.end = function() {
  this.endedAt = Date.now();
  return this.save();
};

module.exports = mongoose.model('TimeLog', timeLogSchema);
