const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, "secret_string");
  if (decodedToken.userRole !== "admin") {
    return res.status(403).json({ message: "Access denied 123!" });
  }
  next();
};
