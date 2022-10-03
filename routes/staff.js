const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')

const staffController = require('../controllers/staff');

router.get('/:staffId/detail', auth.checkLogin, staffController.getStaff);
router.get('/', auth.checkLogin, staffController.getIndex);

module.exports = router;
