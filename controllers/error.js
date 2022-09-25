exports.get403 = (req, res, next) => {
    res.status(403).render('403', { pageTitle: 'Forbidden', path: '/403' });
};

exports.get404 = (req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404' });
};
