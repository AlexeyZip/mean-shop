const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Auth = require("../models/auth");

router.post("/signup", (req, res, next) => {
  const role = req.body.role || "user";
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const auth = new Auth({
      email: req.body.email,
      password: hash,
      role: role,
    });
    auth
      .save()
      .then((response) => {
        res.status(201).json({
          message: "User was created successfully",
          result: response,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Invalid authentication credentials!",
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  Auth.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) return failedAuth(res);
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) return failedAuth(res);
      const token = jwt.sign(
        {
          email: fetchedUser.email,
          userId: fetchedUser._id,
          userRole: fetchedUser.role,
        },
        "secret_string",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        userRole: fetchedUser.role,
      });
    })
    .catch((err) => {
      failedAuth(res);
    });
});

function failedAuth(res) {
  return res.status(401).json({
    message: "Invalid authentication credentials!",
  });
}

module.exports = router;
