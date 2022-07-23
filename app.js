const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const adminRouters = require('./routes/admin');
const shopRouters = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));

app.use(adminRouters);
app.use(shopRouters);

app.listen(3000);