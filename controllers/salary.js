const moment = require('moment');
const TimeLog = require('../models/time-log');
const AnnualLeave = require('../models/annual-leave');
const StaffService = require('../services/staff');
const staff = require('../models/staff');


exports.list = async (req, res, next) => {

  const month = req.body.month || moment().month() + 1;
  const year = req.body.year || moment().year();

  const dateS = moment(new Date(year, month - 1, 1)).format('YYYY-MM-DD'); // ngày đầu của tháng
  const dateE = moment(new Date(year, month, 0)).format('YYYY-MM-DD');   // ngày cuối của tháng

  let logs = await StaffService.timeLogOfMonth(res.locals.staff, dateS, dateE);

  let leaves = await StaffService.getLeaveOfMonth(res.locals.staff, dateS, dateE);

  const data = [];

  let currentDate = dateS;

  while (currentDate <= dateE) {
    const dateData = {
      date: currentDate,
      dayLogs: [],
      working: 0,
      leave: 0,
      notWorking: 0,
      overTime: 0
    };

    // lấy timeLog
    const dayLogs = logs.filter((log) => moment(log.startedAt).format('YYYY-MM-DD') == dateData.date);
    dateData.dayLogs = dayLogs.map((log) => ({
      startedAt: moment(log.startedAt).format('h:mm a'),
      endedAt: moment(log.endedAt).format('h:mm a'),
      workplace: log.workplace
    }));

    // tính thời gian làm việc
    let working = 0;
    dayLogs.forEach((log) => {
      working += (log.endedAt || Date.now()) - log.startedAt;
    });
    dateData.working = Math.round(working * 10 / 1000 / 3600) / 10;

    // tính số giờ đã nghỉ
    const off = leaves.filter((log) => moment(log.startLeave).format('YYYY-MM-DD') == currentDate);
    off.forEach((log) => {
      dateData.leave += log.duration;
    });

    //tính số giờ làm thêm
    let overTime = (dateData.working + dateData.leave) - 8;
    if (overTime >= 0) {
      dateData.overTime = Math.round(overTime * 10) / 10;
    } else {
      dateData.notWorking = -Math.round(overTime * 10) / 10;
    };

    // push data theo ngày
    data.push(dateData);
    //console.log(dateData);

    //tăng ngày
    currentDate = moment(currentDate).add(1, 'day').format('YYYY-MM-DD');
  }

  res.render('salary/list', {
    pageTitle: 'TimeLog List',
    path: '/staff/salary/list',
    data: data,
    month: month,
    year: year
  });

};







// lương tháng (MH-3)
exports.salary = async (req, res, next) => {

  const month = req.body.month;
  const year = req.body.year;
  const dateS = new Date(year, month - 1, 1); // ngày đầu của tháng
  const dateE = new Date(year, month, 0);   // ngày cuối của tháng

  let total = 0;
  let notWorking = 0;
  let overTime = 0;
  let salary = 0;
  let daysLeaves = 0;

  let logs = await StaffService.timeLogOfMonth(res.locals.staff, dateS, dateE);
  let leaves = await StaffService.getLeaveOfMonth(res.locals.staff, dateS, dateE);

  leaves.forEach(leave => {
    daysLeaves += leave.duration;
  });

  logs.forEach(log => {
    total += (log.endedAt || Date.now()) - log.startedAt;
    if (total + daysLeaves * 3600 > 8 * 1000 * 3600) {
      overTime += (total + daysLeaves * 3600 - 8 * 1000 * 3600);
    } else {
      notWorking += (8 * 1000 * 3600 - total - daysLeaves * 3600);
    }
  });

  //tính thời gian tổng, lương tổng của tháng
  total = Math.round(total * 10 / 1000 / 3600) / 10;
  notWorking = Math.round(notWorking * 10 / 1000 / 3600) / 10;
  overTime = Math.round(overTime * 10 / 1000 / 3600) / 10;
  // daysLeaves = Math.round(daysLeaves * 10 * 3600) /10;
  salary = res.locals.staff.salaryScale * 3000000 + (overTime - notWorking) * 200000;

  console.log(total);
  console.log(notWorking);
  console.log(daysLeaves);
  console.log(salary);


  res.render('salary/salary', {
    pageTitle: 'Salary',
    path: '/staff/salary/calculate',
    data: data,
    total: total,
    overTime: overTime,
    leave: daysLeaves,
    salary: salary
  });
};
