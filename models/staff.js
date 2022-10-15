const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const staffSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: true
  },
  doB: {
    type: Date,
    required: true
  },
  salaryScale: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  annualLeave: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Staff', staffSchema);
