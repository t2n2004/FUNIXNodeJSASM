const Staff = require('../models/staff');
const TimeLog = require('../models/time-log');

exports.getIndex = (req, res, next) => {
  Staff.find()
    .then(staffs => {
      //console.log(staffs);
      res.render('home', {
        staffs: staffs,
        pageTitle: 'Home',
        path: '/'
      });
    })
    .catch(err => console.log(err));

};


exports.getAttendance = (req, res, next) => {
    const staffId = req.user.staffId;
    Staff.findById(staffId)
      .then(staff => {
        if (!staff) {
            return res.redirect('/');
        }
        res.render('attendance', {
          staff: staff,
          pageTitle: 'Attendance',
          path: '/staff/attendance'
        });
      })
      .catch(err => console.log(err));
};

exports.getStaff = (req, res, next) => {
  const staffId = req.user.staffId;
  Staff.findById(staffId)
    .then(staff => {
      if (!staff) {
          return res.redirect('/');
      }
      res.render('staff-detail', {
        staff: staff,
        pageTitle: staff.name,
        path: '/staff/detail'
      });
    })
    .catch(err => console.log(err));
};


// edit imageUrl
exports.getEditImageUrl = (req, res, next) => {
  const staffId = req.user.staffId;
  Staff.findById(staffId)
    .then(staff => {
      if (!staff) {
        return res.redirect('/');
      }
      res.render('edit-imageUrl', {
        pageTitle: 'Edit Image URL',
        path: '/staff/edit-imageUrl',
        staff: staff
      });
    })
    .catch(err => console.log(err));
};

exports.postEditImageUrl = (req, res, next) => {
    const staffId = req.body.staffId;
    const updatedImageUrl = req.body.imageUrl;
    Staff.findById(staffId)
    .then(staff => {
      staff.imageUrl = updatedImageUrl
      return staff.save();
    })
    .then(result => {
      console.log(result);
      console.log('UPDATED Staff!');
      res.redirect('/staff/detail');
    })
    .catch(err => console.log(err));
};



// time-log
exports.list = async (req, res, next) => {
  if (!res.locals.staff) {
      return res.redirect('/404');
  }

  const timeLogs = await TimeLog.find({
      staffId: req.user.staffId,
  })

  let total = 0;
  timeLogs.forEach((log) => {
      const endedAt = log.endedAt ? log.endedAt.getTime() : Date.now();
      total += endedAt - log.startedAt.getTime();
  });

  res.render('time-log/list', {
      pageTitle: 'Time Log',
      path: 'staff/time-log',
      timeLogs,
      total,
  });
};



exports.start = async (req, res, next) => {
  if (!res.locals.staff) {
      return res.status(400).json({ message: 'Bad request' });
  }

  const timeLog = new TimeLog({
      staffId: req.user.staffId,
  });

  try {
      await timeLog.save();
      res.redirect('/staff/attendance');
  } catch (err) {
      console.log(err);
  }
};



exports.end = async (req, res, next) => {
  if (!res.locals.staff) {
      return res.status(400).json({ message: 'Bad request' });
  }

  const timeLog = await TimeLog.findOne({ 
      staffId: req.user.staffId,
      endedAt: null
  });

  if (!timeLog) {
      return res.redirect('/404')
  }

  await timeLog.end();
  res.redirect('/staff/attendance');
};


