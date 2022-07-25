const path = require('path');

const express = require('express');
const { join } = require('path');

const rootDiv = require('../util/path');

const router = express.Router();

// /admin/add-product --> GET
router.get('/add-product', (req, res, next) => {
    console.log('In another middleware!');
    res.sendFile(path.join(rootDiv,'views','/add-product.html'));
});


// /admin/add-product --> POST
router.post('/add-product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;