const Staff = require('../models/staff');
const StaffService = require('../services/staff');

exports.getHome = async (req, res, next) => {
  const isWorking = await StaffService.isWorking(res.locals.staff);
  const currentTimeLog = await StaffService.getCurrentTimeLog(res.locals.staff);
  const staffId = req.user.staffId;
    Staff.findById(staffId)
      .then(staff => {
        res.render('home', {
          staff: staff,
          pageTitle: 'Home',
          path: '/',
          isWorking: isWorking,
          currentTimeLog: currentTimeLog
        });
      })
      .catch(err => console.log(err));
  };

