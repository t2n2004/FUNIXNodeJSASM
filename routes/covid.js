const express = require('express');
const router = express.Router();
const covidController = require('../controllers/covid');
const auth = require('../middlewares/auth')

router.get('/',auth.checkLogin, covidController.index);

router.get('/body-temperature',auth.checkLogin, covidController.getBodyTemps);
router.post('/body-temperature',auth.checkLogin, covidController.postBodyTemp);



router.get('/covid',auth.checkLogin, covidController.getCovids);
router.post('/covid',auth.checkLogin, covidController.postCovid);


router.get('/vaccine',auth.checkLogin, covidController.getVaccines);
router.post('/vaccine',auth.checkLogin, covidController.postVaccine);

module.exports = router;
