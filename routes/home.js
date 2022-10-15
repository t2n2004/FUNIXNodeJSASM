const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');
const auth = require('../middlewares/auth')

router.get('/',auth.checkLogin, homeController.getHome);

module.exports = router;
