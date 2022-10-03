const Staff = require('../models/staff');

exports.getIndex = (req, res, next) => {
    const staffId = req.params.staffId;
    Staff.findById(staffId)
      .then(staff => {
        if (!staff) {
            return res.redirect('/');
        }
        res.render('attendance', {
          staff: staff,
          pageTitle: 'Attendance',
          path: '/staff'
        });
      })
      .catch(err => console.log(err));
};

exports.getStaff = (req, res, next) => {
    const staffId = req.params.staffId;
    Staff.findById(staffId)
      .then(staff => {
        if (!staff) {
            return res.redirect('/');
        }
        res.render('staff-detail', {
          staff: staff,
          pageTitle: staff.name,
          path: '/staff' + staffId + '/detail'
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
      res.redirect('/staff' + staffId + '/detail');
    })
    .catch(err => console.log(err));
};



