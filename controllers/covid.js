const Staff = require('../models/staff');
const BodyTemp = require('../models/covid').bodyTemp;
const Vaccine = require('../models/covid').vaccine;
const Covid = require('../models/covid').covid;

exports.index = async (req, res, next) => {
    const staffId = req.user.staffId;
    Staff.findById(staffId)
      .then(staff => {
        res.render('covid/index', {
        pageTitle: 'Covid Curriculum',
        path: 'staff/covid-curriculum',
        staff: staff
        })
      });
};

//body-temperature

exports.getBodyTemps = (req, res, next) => {
  BodyTemp.find()
    .then(temps => {
      console.log(temps);
      res.render('covid/body-temp', {
        temps: temps,
        pageTitle: 'Body Temperature',
        path: '/staff/covid/body-temperature'
      });
    })
    .catch(err => console.log(err));
};


exports.postBodyTemp = async (req, res, next) => {

  const bodyTemp = new BodyTemp({
    staffId: res.locals.staff._id,
    date: req.body.date,
    temp: req.body.temp
  });

  await bodyTemp.save();
  console.log('Body Temp Summited!');
res.redirect('/staff/covid/body-temperature');
};


//covid

exports.getCovids = (req, res, next) => {
  Covid.find()
    .then(covids => {
      console.log(covids);
      res.render('covid/covid', {
        covids: covids,
        pageTitle: 'Covid History',
        path: '/staff/covid/covid'
      });
    })
    .catch(err => console.log(err));
};


exports.postCovid = async (req, res, next) => {

  const covid = new Covid({
    staffId: res.locals.staff._id,
    start: req.body.start,
    end: req.body.end
  });

  await covid.save();
  console.log('Covid History Summited!');
res.redirect('/staff/covid/covid');
};


//vaccine

exports.getVaccines = (req, res, next) => {
  Vaccine.find()
    .then(vaccines => {
      console.log(vaccines);
      res.render('covid/vaccine', {
        vaccines: vaccines,
        pageTitle: 'Vaccination',
        path: '/staff/covid/vaccine'
      });
    })
    .catch(err => console.log(err));
};


exports.postVaccine = async (req, res, next) => {

  const vaccine = new Vaccine({
    staffId: res.locals.staff._id,
    date: req.body.date,
    vaccine: req.body.vaccine
  });

  await vaccine.save();
  console.log('Vaccination Summited!');
res.redirect('/staff/covid/vaccine');
};
