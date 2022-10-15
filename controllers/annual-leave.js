
const AnnualLeave = require('../models/annual-leave');
const Staff = require('../models/staff');

exports.index = async (req, res, next) => {
    const staffId = req.user.staffId;
    Staff.findById(staffId)
      .then(staff => {
        res.render('annual-leave', {
        pageTitle: 'Annual Leave',
        path: 'staff/annual-leave',
        staff: staff
        })
      });
    };


exports.postLeave = async (req, res, next) => {

    const annualLeave = new AnnualLeave({
      staffId: res.locals.staff._id,
      startLeave: req.body.startLeave,
      endLeave: req.body.endLeave
    });

    await annualLeave.save();
    console.log('Annual Leave Summited!');
  res.redirect('/staff/annual-leave');
};

