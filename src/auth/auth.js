const express = require("express");
const router = express.Router();
const { validateJWT } = require("./../middlewares/validate-jwt");
const { check } = require("express-validator");

const { validateFields } = require("./../middlewares/validateField");
const { registerUser, renewUser, loginUser } = require("./authController");

router.get("/", (req, res) => {
  res.json({
    status: "ok",
  });
});

router.post(
  "/login",
  [
    check("email", "Email es obligatorio").isEmail(),
    check("password", "Password es obligatorio").isLength({ min: 6 }),
    validateFields,
  ],
  loginUser
);

router.post(
  "/register",
  [
    check("name", "Nombre es obligatorio").notEmpty(),
    check("email", "Email es obligatorio").isEmail(),
    check("password", "Password es obligatorio").isLength({ min: 6 }),
    validateFields,
  ],
  registerUser
);

router.get("/renew", validateJWT, renewUser);

module.exports = router;
