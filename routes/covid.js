const express = require('express');
const router = express.Router();
const covidController = require('../controllers/covid');
const auth = require('../middlewares/auth')

router.get('/',auth.checkLogin, covidController.index);

router.get('/body-temperature',auth.checkLogin, covidController.getBodyTemps);
router.get('/add-body-temperature',auth.checkLogin, covidController.getAddBodyTemp);
router.post('/add-body-temperature',auth.checkLogin, covidController.postAddBodyTemp);



router.get('/covid',auth.checkLogin, covidController.getCovids);
router.get('/add-covid',auth.checkLogin, covidController.getAddCovid);
router.post('/add-covid',auth.checkLogin, covidController.postAddCovid);


router.get('/vaccine',auth.checkLogin, covidController.getVaccines);
router.get('/add-vaccine',auth.checkLogin, covidController.getAddVaccine);
router.post('/add-vaccine',auth.checkLogin, covidController.postAddVaccine);

module.exports = router;
