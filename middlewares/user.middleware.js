exports.isMine = ({ user, params }, res, next) =>
  params?.id && user?._id.toString() !== params.id.toString()
    ? res.redirect("/")
    : next();
exports.isAdmin = ({user}, res, next) => user?.type === "admin" ? next() : res.redirect("/");
