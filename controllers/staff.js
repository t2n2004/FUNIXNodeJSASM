const Staff = require('../models/staff');

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



