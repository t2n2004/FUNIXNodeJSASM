const Staff = require('../models/staff');
const TimeLog = require('../models/time-log');

exports.getIndex = async (req, res, next) => {
    let currentTimeLog = null;

    if (res.locals.staff) {
        currentTimeLog = await TimeLog.findOne({
            staffId: res.locals.staff._id,
            endedAt: null,
        });
    }

    res.render('index', {
        pageTitle: 'Index',
        path: '/index',
        currentTimeLog,
    });
};