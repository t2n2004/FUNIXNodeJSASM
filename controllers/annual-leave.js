
const AnnualLeave = require('../models/annual-leave');
const Staff = require('../models/staff');
const StaffService = require('../services/staff');

exports.index = async (req, res, next) => {
    const staffId = req.user.staffId;

    const dateS = new Date(new Date().getFullYear(), 0, 1);
    const dateE = new Date(new Date().getFullYear(), 11, 31);

    let totalLeaves = 0

    const thisYearLeaves = await StaffService.leaves(res.locals.staff, dateS, dateE );

    thisYearLeaves.forEach(leave => {
      totalLeaves += Math.round((leave.endLeave - leave.startLeave)/ 1000 / 3600 / 100 * 10 )/ 10; 
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
    endLeave: req.body.endLeave
  });

  await annualLeave.save();
  console.log('Annual Leave Summited!');
  res.redirect('/staff/annual-leave');
};

