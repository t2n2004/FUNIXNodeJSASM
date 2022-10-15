const Staff = require('../models/staff');
const TimeLog = require('../models/time-log');
const StaffService = require('../services/staff');

exports.getIndex = async (req, res, next) => {
  if (!res.locals.user) {
    return res.render('index', {
      pageTitle: 'Home',
      path: '/index',
    });
  }

  const isWorking = await StaffService.isWorking(res.locals.staff);

  res.render('index', {
    pageTitle: 'Home',
    path: '/index',
    isWorking: isWorking
  });
};
