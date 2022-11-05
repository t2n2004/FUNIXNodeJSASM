const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/asm1';

const Staff = require('./models/staff');
const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const timeLogRoutes = require('./routes/time-log');
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');
const staffRoutes = require('./routes/staff');
const annualLeaveRoutes = require('./routes/annual-leave');
const covidRoutes = require('./routes/covid');
const errorController = require('./controllers/error');


const app = express();
const sessionStore = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: sessionStore
    })
);

app.use(csrfProtection);
app.use(flash());

app.use(async (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.user = req.session.user;

    if (res.locals.user && res.locals.user.staffId) {
        res.locals.staff = await Staff.findOne(res.locals.user.staffId);
    }

    next();
});

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }

    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err));
        });
});

app.use('/admin', adminRoutes);
app.use('/staff/time-log', timeLogRoutes);
app.use('/', homeRoutes);
app.use('/staff', staffRoutes);
app.use(authRoutes);
app.use('/staff/annual-leave', annualLeaveRoutes);
app.use('/staff/covid', covidRoutes);

app.use('/forbidden', errorController.get403);
app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });