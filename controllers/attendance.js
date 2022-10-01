const TimeLog = require('./models/time-log');

exports.list = async (req, res, next) => {
    if (!res.locals.staff) {
        return res.redirect('/404');
    }

    const timeLogs = await TimeLog.find({
        staffId: res.locals.staff._id,
    })

    let total = 0;
    timeLogs.forEach((log) => {
        const endedAt = log.endedAt ? log.endedAt.getTime() : Date.now();
        total += endedAt - log.startedAt.getTime();
    });

    res.render('attendance', {
        pageTitle: 'Attendance',
        path: '/attendance',
        timeLogs,
        total,
    });
};

exports.start = async (req, res, next) => {
    if (!res.locals.staff) {
        return res.status(400).json({ message: 'Bad request' });
    }

    const timeLog = new TimeLog({
        staffId: res.locals.staff._id,
    });

    try {
        await timeLog.save();
        res.redirect('/');
    } catch (err) {
        console.log(err);
    }
};

exports.end = async (req, res, next) => {
    if (!res.locals.staff) {
        return res.status(400).json({ message: 'Bad request' });
    }

    const timeLog = await TimeLog.findOne({ 
        staffId: res.locals.staff._id,
        endedAt: null
    });

    if (!timeLog) {
        return res.redirect('/404')
    }

    await timeLog.end();
    res.redirect('/');
};