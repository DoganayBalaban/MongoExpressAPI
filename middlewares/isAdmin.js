module.exports = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).send("Erişim yetkiniz yok");
  }
  next();
};
