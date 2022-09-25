const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')

const timeLogsController = require('../controllers/time-log');

router.get('/', auth.checkLogin, timeLogsController.list);
router.post('/start', auth.checkLogin, timeLogsController.start);
router.post('/end', auth.checkLogin, timeLogsController.end);

module.exports = router;
