const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')

const staffsController = require('../controllers/admin/staffs');

router.get('/staffs', auth.checkLogin, staffsController.getStaffs);

module.exports = router;
