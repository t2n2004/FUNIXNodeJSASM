const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bodyTempSchema = new Schema({
    staffId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Staff'
    },
    date: {
        type: Date,
    },
    temp: {
        type: Number,
    }
});

const vaccineSchema = new Schema({
    staffId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Staff'
    },
    date: {
        type: Date,
    },
    vaccine: {
        type: String,
    }
});

const covidSchema = new Schema({
    staffId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Staff'
    },
    start: {
        type: Date,
    },
    end: {
        type: Date,
    }
});


module.exports.bodyTemp = mongoose.model('BodyTemp', bodyTempSchema);
module.exports.vaccine = mongoose.model('Vaccine', vaccineSchema);
module.exports.covid = mongoose.model('Covid', covidSchema);