const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const annualLeaveSchema = new Schema({
    staffId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Staff'
    },
    startLeave: {
        type: Date,
    },
    endLeave: {
        type: Date,
    }
});


module.exports = mongoose.model('AnnualLeave', annualLeaveSchema);