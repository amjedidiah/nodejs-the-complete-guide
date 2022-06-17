exports.ownsProduct = ({ user, params }, res, next) => {
  if (params?.id && !user?.products.includes(params.id)) return res.redirect('/');
  return next();
};
exports.canDeleteProduct = ({ user, params }, res, next) => (user?.type === 'admin' || user?.products.includes(params.id)
  ? next()
  : res.redirect('/'));
