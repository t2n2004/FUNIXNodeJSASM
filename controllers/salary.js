const moment = require('moment');
const StaffService = require('../services/staff');


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
      endedAt: log.endedAt ? moment(log.endedAt).format('h:mm a') : 'not yet',
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

    //tăng ngày
    currentDate = moment(currentDate).add(1, 'day').format('YYYY-MM-DD');
  };

  //console.log(data);

  res.render('salary/list', {
    pageTitle: 'TimeLog List',
    path: '/staff/salary/list',
    data: data,
    month: month,
    year: year
  });

};



exports.fullList = async (req, res, next) => {

  let logs = await StaffService.getTimeLog(res.locals.staff);
  let leaves = await StaffService.leaves(res.locals.staff);

  const data = [];

  const dateS =  moment((logs[0].startedAt < leaves[0].startLeave) ? logs[0].startedAt :  leaves[0].startLeave).format('YYYY-MM-DD');
  const dateE = moment(logs[logs.length-1].startedAt > leaves[leaves.length-1].startLeave ? logs[logs.length-1].startedAt : leaves[leaves.length-1].startLeave ).format('YYYY-MM-DD');
  
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
      endedAt: log.endedAt ? moment(log.endedAt).format('h:mm a') : 'not yet',
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

    //tăng ngày
    currentDate = moment(currentDate).add(1, 'day').format('YYYY-MM-DD');
  }

  console.log('data', JSON.stringify(data));

  //filter
  let dataFilter = [];
  const category = req.body.category ;
  const keyword = req.body.keyword ;
  console.log(category);
  console.log(keyword);

  if (category && keyword) { 
    dataFilter = data.filter((log) => log.dayLogs.workplace == "Home" );

  } else {
    dataFilter = [...data];
  }


  res.render('salary/full-list', {
    pageTitle: 'TimeLog Full List',
    path: '/staff/salary/full-list',
    category: category,
    keyword: keyword,
    data: dataFilter,
  });

};



// lương tháng (MH-3)
exports.salary = async (req, res, next) => {

  const month = req.body.month || moment().month() + 1;
  const year = req.body.year || moment().year();

  const dateS = moment(new Date(year, month - 1, 1)).format('YYYY-MM-DD'); // ngày đầu của tháng
  const dateE = moment(new Date(year, month, 0)).format('YYYY-MM-DD');   // ngày cuối của tháng

  const numberOfDays = new Date(year, month, 0).getDate();
  let total = 0;
  let notWorking = 0;
  let overTime = 0;
  let salary = 0;
  let leave = 0;

  let logs = await StaffService.timeLogOfMonth(res.locals.staff, dateS, dateE);
  let leaves = await StaffService.getLeaveOfMonth(res.locals.staff, dateS, dateE);

  // tính thời gian làm việc
  logs.forEach((log) => {
    total += (log.endedAt || Date.now()) - log.startedAt;
  });
  total = Math.round(total * 10 / 1000 / 3600) / 10;

  // tính số giờ đã nghỉ
  leaves.forEach((log) => {
    leave += log.duration;
  });

  //tính số giờ làm thêm
  overTime = (total + leave) - 8 * numberOfDays ;
  if (overTime >= 0) {
    overTime = Math.round(overTime * 10) / 10;
  } else {
    notWorking = -Math.round(overTime * 10) / 10;
    overTime = 0;
  };

  salary = res.locals.staff.salaryScale * 3000000 + (overTime - notWorking) * 200000;

  console.log(month, year);
  console.log('số ngày trong tháng là:', numberOfDays);
  console.log('số giờ đã làm là: ', total);
  console.log('số giờ làm thiếu là: ', notWorking);
  console.log('số giờ làm thêm là: ', overTime);
  console.log('số giờ nghỉ là: ', leave);
  console.log('Lương là: ', salary);


  res.render('salary/salary', {
    pageTitle: 'Salary',
    path: '/staff/salary/calculate',
    total: total,
    overTime: overTime,
    leave: leave,
    salary: salary,
    notWorking: notWorking,
    month: month,
    year: year
  });
};

