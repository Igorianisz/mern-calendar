const { response } = require("express");
const { validationResult } = require("express-validator");
const Usuario = require("../../models/Usuario");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../../helpers/jtw");

const registerUser = async (req, res = response) => {
  const { name, email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({
      email,
    });

    if (usuario) {
      return res.status(400).json({
        ok: false,
        status: "error",
        msg: "El usuario ya existe",
      });
    }
    usuario = new Usuario(req.body);

    const salt = bcrypt.genSaltSync();

    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    const token = await generateJWT(usuario?._id.toString(), usuario.name);

    res.status(201).json({
      ok: true,
      status: "ok",
      msg: "Crear usuario",
      user: usuario.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      status: "error",
      uid: usuario?._id.toString(),
      msg: "Error al crear usuario. Contactese con el admin",
    });
  }
};

const renewUser = async (req, res = response) => {
  const { uid, name } = req;

  const token = await generateJWT(uid, name);

  res.json({
    ok: true,
    status: "ok",
    msg: "Renovar usuario",
    uid,
    name,
    token,
  });
};

const loginUser = async (req, res = response) => {
  const { name, email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({
      email,
    });

    if (!usuario) {
      console.log(0);
      return res.status(400).json({
        ok: false,
        status: "error",
        msg: "Usuario o contraseña incorrectos",
      });
    }

    const validPassword = bcrypt.compareSync(password, usuario.password);

    if (!validPassword) {
      console.log(2);
      res.status(400).json({
        ok: false,
        status: "error",
        msg: "Usuario o contraseña incorrectos",
      });
      return;
    }

    const token = await generateJWT(usuario?._id.toString(), usuario.name);
    console.log();
    res.status(200).json({
      ok: true,
      status: "ok",
      msg: "Login usuario",
      uid: usuario?._id.toString(),
      name: usuario.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      status: "error",
      msg: "Error al logear usuario. Contactese con el admin ",
    });
  }
};

module.exports = { registerUser, renewUser, loginUser };
