const Staff = require('../models/staff');

exports.getHome = (req, res, next) => {
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