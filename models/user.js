const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    dropDups: true
  },
  password: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    default: false
  },
  staffId: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
},
});

module.exports = mongoose.model('User', userSchema);
