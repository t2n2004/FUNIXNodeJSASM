const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')
const salaryController = require('../controllers/salary');

router.get('/staff/salary',auth.checkLogin, salaryController.list);
router.post('/staff/salary',auth.checkLogin, salaryController.list);
router.get('/staff/salary/full-list',auth.checkLogin, salaryController.fullList);
router.get('/staff/salary/calculate',auth.checkLogin, salaryController.salary);
router.post('/staff/salary/calculate',auth.checkLogin, salaryController.salary);

module.exports = router;
