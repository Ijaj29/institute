
exports.permission = function (...allowed) {
  return (req, res, next) => {
    if (req.tokenObject.unm && allowed.includes(req.tokenObject.role))
      next();
    else {
      // req.session.destroy();
      res.redirect('/login');
    }
  }
}
