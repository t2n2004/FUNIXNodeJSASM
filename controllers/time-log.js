const moment = require('moment');
const TimeLog = require('../models/time-log');
const AnnualLeave = require('../models/annual-leave');
const StaffService = require('../services/staff');


exports.index = async (req, res, next) => {
  const currentTimeLog = await StaffService.getCurrentTimeLog(res.locals.staff);

  res.render('time-log/index', {
    pageTitle: 'Time Log',
    path: '/staff/time-log',
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

  res.redirect('/staff/time-log/history');
};

exports.list = async (req, res, next) => {
  const today = moment().format('dddd, MMMM Do, YYYY');
  const logs = await StaffService.todayTimeLog(res.locals.staff);
  let total = 0;

  logs.forEach(log => {
    total += (log.endedAt || Date.now()) - log.startedAt;
  });

  res.render('time-log/list', {
    pageTitle: 'Time Log History',
    path: '/staff/time-log/history',
    today,
    logs: logs.map((log) => ({
      start: moment(log.startedAt).format('h:mm a'),
      end: log.endedAt ? moment(log.endedAt).format('h:mm a') : null,
      workplace: log.workplace
    })),
    total: Math.round(total * 10 / 1000 / 3600) / 10,
  });
};

// Màn hình Tra cứu thông tin giờ làm (của toàn bộ quá trình làm ở công ty, không theo tháng), lương tháng (MH-3)
exports.salary = async (req, res, next) => {
  const today = moment().format('dddd, MMMM Do, YYYY');
  const logs = await StaffService.todayTimeLog(res.locals.staff);
  let total = 0;
  let notWorking = 0;
  let overTime = 0;

  logs.forEach(log => {
    total += (log.endedAt || Date.now()) - log.startedAt;
    if (total > 8 * 1000 * 3600) {
      overTime += (total - 8 * 1000 * 3600); 
    } else {
      notWorking += (8 * 1000 * 3600 - total);
    }
  });

  res.render('salary', {
    pageTitle: '',
    path: '/staff/salary',
    today,
    logs: logs.map((log) => ({
      start: moment(log.startedAt).format('h:mm a'),
      end: log.endedAt ? moment(log.endedAt).format('h:mm a') : null,
      workplace: log.workplace
    })),
    total: Math.round(total * 10 / 1000 / 3600) / 10,
  });
};
