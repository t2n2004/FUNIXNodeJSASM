const Staff = require('../models/staff');
const TimeLog = require('../models/time-log');

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

