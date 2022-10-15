const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')
const timeLogController = require('../controllers/time-log');

router.get('/',auth.checkLogin, timeLogController.index);
router.post('/',auth.checkLogin, timeLogController.postWorking);
router.get('/list',auth.checkLogin, timeLogController.list);

module.exports = router;
