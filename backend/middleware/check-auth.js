const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "secret_string");
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed 123" });
  }
};
