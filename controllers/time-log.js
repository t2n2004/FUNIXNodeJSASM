const moment = require('moment');
const Staff = require('../models/staff');
const TimeLog = require('../models/time-log');
const StaffService = require('../services/staff');

exports.index = async (req, res, next) => {
  const currentTimeLog = await StaffService.getCurrentTimeLog(res.locals.staff);

  res.render('time-log/index', {
    pageTitle: 'Time Log',
    path: 'staff/time-log',
    currentTimeLog,
  });
};

exports.postWorking = async (req, res, next) => {
  const currentTimeLog = await StaffService.getCurrentTimeLog(res.locals.staff);

  if (currentTimeLog) {
    await currentTimeLog.end();
  } else {
    const timeLog = new TimeLog({
      staffId: res.locals.staff._id,
      workplace: req.body.workplace,
    });

    await timeLog.save();
  }

  res.redirect('/time-log');
};

exports.list = async (req, res, next) => {
  const today = moment().format('dddd, MMMM Do, YYYY');
  const logs = await StaffService.todayTimeLog(res.locals.staff);
  let total = 0;

  logs.forEach(log => {
    total += (log.endedAt || Date.now()) - log.startedAt
  });

  res.render('time-log/list', {
    pageTitle: 'Time Log History',
    path: '/time-log/history',
    today,
    logs: logs.map((log) => ({
      start: moment(log.startedAt).format('h:mm a'),
      end: log.endedAt ? moment(log.endedAt).format('h:mm a') : null,
      workplace: log.workplace
    })),
    total: Math.round(total * 100 / 1000 / 3600) / 100,
  });
};

