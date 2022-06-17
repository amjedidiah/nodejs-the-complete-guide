exports.isMine = ({ user, params }, res, next) => {
  if (params?.id && user?._id.toString() !== params.id.toString()) return res.redirect('/');
  return next();
};
exports.isAdmin = ({ user }, res, next) => (user?.type === 'admin' ? next() : res.redirect('/'));
