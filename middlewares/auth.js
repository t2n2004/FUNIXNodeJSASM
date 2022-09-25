const checkLogin = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }

    next();
}

const checkAdmin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    if (!req.session.user.admin) {
        return res.redirect('/403');
    }

    next();
}

module.exports = {
    checkLogin,
    checkAdmin,
};