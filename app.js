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
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');
const attendRoutes = require('./routes/attendance');
const errorController = require('./controllers/error');
const homeController = require('./controllers/home');
const attendController = require('./controllers/attendance');

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
app.use('/time-log', timeLogRoutes);
app.use('/', homeRoutes);
app.use('/attendance', attendRoutes);
app.use('/index', indexRoutes);
app.use(authRoutes);

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