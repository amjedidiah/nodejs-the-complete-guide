exports.ownsProduct = ({ user, params }, res, next) =>
  params?.id && !user?.products.includes(params.id)
    ? res.redirect("/")
    : next();
exports.canDeleteProduct = ({ user, params }, res, next) =>
  user?.type === "admin" || user?.products.includes(params.id)
    ? next()
    : res.redirect("/");
