const express = require('express');
const router = express.Router();
const auth = require('./middlewares/auth')

const attendController = require('./controllers/attendance');

router.get('/', auth.checkLogin, attendController.list);
router.post('/start', auth.checkLogin, attendController.start);
router.post('/end', auth.checkLogin, attendController.end);

module.exports = router;
