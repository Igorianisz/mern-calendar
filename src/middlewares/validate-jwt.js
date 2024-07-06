const { response } = require("express");
const jwt = require("jsonwebtoken");

const validateJWT = (req, res = response, next) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      status: "error",
      msg: "No hay token en la petición",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    req.uid = payload.id;
    req.name = payload.name;
  } catch (error) {
    return res.status(401).json({
      status: "error",
      msg: "Token no válido",
    });
  }

  next();
};

module.exports = { validateJWT };
