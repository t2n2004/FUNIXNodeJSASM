const StaffService = require('../services/staff');
const AnnualLeave = require('../models/annual-leave');
const Staff = require('../models/staff');

exports.index = async (req, res, next) => {
    const staffId = req.user.staffId;
    const leaves = await StaffService.leaves(res.locals.staff);
    let totalLeaves = 0

    leaves.forEach(leave => {
      totalLeaves += Math.round(leave.duration / 8 * 10) /10; 
    });


    Staff.findById(staffId)
      .then(staff => {
        res.render('annual-leave', {
        pageTitle: 'Annual Leave',
        path: 'staff/annual-leave',
        staff: staff,
        availableLeaves: staff.annualLeave - totalLeaves
        })
      });
    };


exports.postLeave = async (req, res, next) => {

  const annualLeave = new AnnualLeave({
    staffId: res.locals.staff._id,
    startLeave: req.body.startLeave,
    duration: req.body.duration,
    reason: req.body.reason
  });

  await annualLeave.save();
  console.log('Annual Leave Summited!');
  res.redirect('/staff/annual-leave');
};

