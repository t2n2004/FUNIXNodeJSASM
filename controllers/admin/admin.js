const Staff = require('../../models/staff');
//const TimeLog = require('../models/time-log');

exports.postAddStaff = (req, res, next) => {
    const name = req.body.name;
    const doB = req.body.doB;
    const salaryScale = req.body.salaryScale;
    const startDate = req.body.startDate;
    const department = req.body.department;
    const annualLeave = req.body.annualLeave;
    const imageUrl = req.body.imageUrl;

    const staff = new Staff({
      name: name,
      doB: doB,
      salaryScale: salaryScale,
      startDate: startDate,
      department: department,
      annualLeave: annualLeave,
      imageUrl: imageUrl,
      //userId: req.user
    });

    staff
      .save()
      .then(result => {
        // console.log(result);
        console.log('Created Staff');
        res.redirect('/admin/staffs');
      })
      .catch(err => {
        console.log(err);
      });
  };
  
  exports.getEditStaff = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
      return res.redirect('/');
    }
    const staffId = req.params.staffId;
    Staff.findById(staffId)
      .then(staff => {
        if (!staff) {
          return res.redirect('/');
        }
        res.render('admin/edit-staff', {
          pageTitle: 'Edit Staff',
          path: '/admin/edit-staff',
          editing: editMode,
          staff: staff
        });
      })
      .catch(err => console.log(err));
  };
  
  exports.postEditStaff = (req, res, next) => {
    const staffId = req.body.staffId;
    const updatedName = req.body.name;
    const updatedDoB = req.body.doB;
    const updatedSalaryScale = req.body.salaryScale;
    const updatedStartDate = req.body.startDate;
    const updatedDepartment = req.body.department;
    const updatedAnnualLeave = req.body.annualLeave;
    const updatedImageUrl = req.body.imageUrl;

  
    Staff.findById(staffId)
      .then(staff => {
        staff.name = updatedName;
        staff.doB = updatedDoB;
        staff.salaryScale = updatedSalaryScale;
        staff.startDate = updatedStartDate;
        staff.department = updatedDepartment;
        staff.annualLeave = updatedAnnualLeave;
        staff.imageUrl = updatedImageUrl
        return staff.save();
      })
      .then(result => {
        console.log('UPDATED Staff!');
        res.redirect('/admin/staffs');
      })
      .catch(err => console.log(err));
  };