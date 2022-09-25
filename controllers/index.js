const Staff = require('../../models/staff');

exports.getStaffs = (req, res, next) => {
    Staff.find()
        .then(staffs => {
            res.render('admin/staffs', {
                staffs: staffs,
                pageTitle: 'Staffs',
                path: '/'
            });
        })
        .catch(err => {
            console.log(err);
        });
};