const path = require('path');

const express = require('express');
const rootDiv = require('../util/path');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.sendFile(path.join(rootDiv,'views','shop.html'));
});

module.exports = router;