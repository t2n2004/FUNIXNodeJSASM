const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')

const staffController = require('../controllers/staff');

router.get('/', auth.checkLogin, staffController.getIndex);
router.get('/detail', auth.checkLogin, staffController.getStaff);
router.get('/attendance', auth.checkLogin, staffController.getAttendance);
router.get('/edit-imageUrl', auth.checkLogin, staffController.getEditImageUrl);
router.get('/edit-imageUrl', auth.checkLogin, staffController.postEditImageUrl);

module.exports = router;
