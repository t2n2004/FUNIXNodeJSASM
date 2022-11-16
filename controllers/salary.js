const moment = require('moment');
const TimeLog = require('../models/time-log');
const AnnualLeave = require('../models/annual-leave');
const StaffService = require('../services/staff');
const staff = require('../models/staff');


exports.index = async (req, res, next) => {
    const staffId = req.user.staffId.toString();
    TimeLog.find({staffId: staffId})
      .then(logs => {
        console.log(logs);
        res.render('salary/list', {
            pageTitle: 'Working Information',
            path: '/staff/working-information',
            logs: logs
          }
        );
      })
      .catch(err => console.log(err));
};


// lương tháng (MH-3)
exports.salary = async (req, res, next) => {
  const dateS = req.body.dateS;
  const dateE = req.body.dateE;

  let total = 0;
  let notWorking = 0;
  let overTime = 0;
  let salary = 0;
  let daysLeaves = 0;

  let logs = await StaffService.timeLogOfMonth(res.locals.staff, dateS, dateE);
  let leaves = await StaffService.getLeaveOfMonth(res.locals.staff, dateS, dateE);

  leaves.forEach(leave => {
    daysLeaves += leaves.duration;
  });

  logs.forEach(log => {
    total += (log.endedAt || Date.now()) - log.startedAt;
    if (total + daysLeaves * 3600 > 8 * 1000 * 3600) {
      overTime += (total + daysLeaves * 3600 - 8 * 1000 * 3600); 
    } else {
      notWorking += (8 * 1000 * 3600 - total - daysLeaves * 3600);
    }
  });


  total = Math.round(total * 10 / 1000 / 3600) / 10;
  notWorking = Math.round(notWorking * 10 / 1000 / 3600) /10;
  overTime = Math.round(overTime * 10 / 1000 / 3600) / 10;
  daysLeaves = Math.round(daysLeaves * 10 * 3600) /10;

  salary = staff.salaryScale * 3000000 + (overTime - notWorking) * 200000;

  res.render('/salary/salary', {
    pageTitle: '',
    path: '/staff/salary',
    logs: logs.map((log) => ({
      date: moment(log.startedAt).format('dddd, MMMM Do, YYYY'),
      start: moment(log.startedAt).format('h:mm a'),
      end: log.endedAt ? moment(log.endedAt).format('h:mm a') : null,
      workplace: log.workplace
    })),
    total: total,
    overTime: overTime,
    leave: daysLeaves,
    salary: salary
  });
};
