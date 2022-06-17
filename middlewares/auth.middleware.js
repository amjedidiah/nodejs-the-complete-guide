exports.isAuth = ({ session: { isLoggedIn } }, res, next) => (isLoggedIn ? next() : res.redirect('/login'));
exports.isUnAuth = ({ session: { isLoggedIn } }, res, next) => (!isLoggedIn ? next() : res.redirect('/'));
