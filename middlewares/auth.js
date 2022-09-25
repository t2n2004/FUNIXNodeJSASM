const checkLogin = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login?redirectUrl=' + req.originalUrl);
    }

    next();
}

const checkAdmin = (req, res, next) => {
    checkLogin(req, res, () => {
        if (!req.session.user.admin) {
            return res.redirect('/forbidden');
        }

        next();
    });
}

module.exports = {
    checkLogin,
    checkAdmin,
};