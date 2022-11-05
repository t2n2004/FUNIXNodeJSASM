const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')

const staffController = require('../controllers/staff');

// router.get('/', auth.checkLogin, staffController.getIndex);
router.get('/detail', auth.checkLogin, staffController.getStaff);
router.get('/edit-imageUrl', auth.checkLogin, staffController.getEditImageUrl);
router.post('/edit-imageUrl', auth.checkLogin, staffController.postEditImageUrl);

// router.get('/time-log', auth.checkLogin, staffController.list);
// router.post('/start', auth.checkLogin, staffController.start);
// router.post('/end', auth.checkLogin, staffController.end);

module.exports = router;
