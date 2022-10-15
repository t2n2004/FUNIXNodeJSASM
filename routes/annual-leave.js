const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')
const annualLeaveController = require('../controllers/annual-leave');

router.get('/',auth.checkLogin, annualLeaveController.index);
router.post('/',auth.checkLogin, annualLeaveController.postLeave);

module.exports = router;
