const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')
const salaryController = require('../controllers/salary');

router.get('/staff/salary/index',auth.checkLogin, salaryController.index);
router.post('/staff/salary/index',auth.checkLogin, salaryController.postInputMonth);
router.get('/staff/salary/list',auth.checkLogin, salaryController.list);
router.get('/staff/salary/calculate',auth.checkLogin, salaryController.salary);

module.exports = router;
