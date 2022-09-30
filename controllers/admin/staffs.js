const Staff = require('../../models/staff');

exports.getStaffs = (req, res, next) => {
    Staff.find()
        .then(staffs => {
            res.render('admin/staffs', {
                staffs: staffs,
                pageTitle: 'Staffs',
                path: '/admin/staffs'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getStaff = (req, res, next) => {
    const staffId = req.params.staffId;
    Staff.findById(staffId)
      .then(staff => {
        res.render('/staff-detail', {
          staff: staff,
          pageTitle: staff.name,
          path: '/staffs'
        });
      })
      .catch(err => console.log(err));
  };
