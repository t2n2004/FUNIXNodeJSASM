const moment = require('moment');
const TimeLog = require('../models/time-log');
const AnnualLeave = require('../models/annual-leave');
const StaffService = require('../services/staff');
const staff = require('../models/staff');

exports.index = async (req, res, next) => {

  res.render('salary/index', {
    pageTitle: 'Input Salary Month',
    path: '/staff/salary/index',
  });

};

// exports.postInputMonth = async (req, res, next) => {
//   const month = req.body.month;
//   const year = req.body.year;
//   const dateS = new Date(year, month-1, 2); // ngày đầu của tháng
//   const dateE = new Date(year, month, 1);   // ngày cuối của tháng

//   console.log(dateS, dateE, month, year);

//   console.log('Month Input successfully');
//   res.redirect('/staff/salary/list');

// };

exports.list = async (req, res, next) => {
  console.log(req.body);
  const month = req.body.month;
  const year = req.body.year;
  const dateS = new Date(year, month-1, 2); // ngày đầu của tháng
  const dateE = new Date(year, month, 1);   // ngày cuối của tháng

  let logs = await StaffService.timeLogOfMonth(res.locals.staff, dateS, dateE);
  console.log('abc');
  let leaves = await StaffService.getLeaveOfMonth(res.locals.staff, dateS, dateE);
  
  const data = [];

  let currentDate = moment(dateS).format('YYYY-MM-DD');
  console.log(currentDate);

  while (currentDate <= moment(dateE).format('YYYY-MM-DD')) {
    const dateData = {
      date: currentDate,
      dayLogs: [],
      working: 0,
      off: 0,
      overTime: 0
    };

    dateData.dayLogs = logs.filter((log) => moment(log.startedAt).format('YYYY-MM-DD') == dateData.date); 
    
    console.log(dateData.dayLogs);
    dateData.dayLogs.forEach((log) => {
      dateData.working += (log.endedAt || Date.now()) - log.startedAt;
    })

    off = leaves.filter((log) => log.startLeave == currentDate); 
    off.forEach((log) => {
      dateData.leave += log.duration;
    });

    data.push(dateData);
    currentDate = moment(currentDate).add(1, 'day');
  }

  console.log(data);

  res.render('salary/list', {
    pageTitle: 'TimeLog List',
    path: '/staff/salary/list',
    data: data,
  });

};


// lương tháng (MH-3)
exports.salary = async (req, res, next) => {

  const month = req.body.month;
  const year = req.body.year;
  const dateS = new Date(year, month-1, 2); // ngày đầu của tháng
  const dateE = new Date(year, month, 1);   // ngày cuối của tháng

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
  notWorking = Math.round(notWorking * 10 / 1000 / 3600) /10;
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
