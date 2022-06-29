exports.isAuth = ({ session: { isLoggedIn } }, res, next) => {
  if (isLoggedIn) return next();
  return res.redirect('/login');
};
exports.isUnAuth = ({ session: { isLoggedIn } }, res, next) => {
  if (!isLoggedIn) return next();
  return res.redirect('/');
};
