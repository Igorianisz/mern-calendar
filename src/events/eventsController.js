const { express, response } = require("express");
const Evento = require("../../models/Evento");

const getEvents = async (req, res = response) => {
  const eventos = await Evento.find().populate("user", "name");
  res.json({
    ok: true,
    status: "ok",
    msg: "getEvents",
    eventos,
  });
};

const createEvents = async (req, res = response) => {
  console.log(req.body);

  const evento = new Evento(req.body);

  try {
    evento.user = req.uid;
    const eventoGuardado = await evento.save();
    res.json({
      ok: true,
      status: "ok",
      msg: "CreateEvents",
      evento: eventoGuardado,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      status: "error",
      msg: "Hable con el administrador",
    });
  }
};

const updateEvents = async (req, res = response) => {
  const { id } = req.params;

  try {
    const evento = await Evento.findById(id);

    if (!evento) {
      return res.status(404).json({
        ok: false,
        status: "error",
        msg: "Evento no encontrado por id",
      });
    }
    const newDataEvent = await Evento.findByIdAndUpdate(
      id,
      { ...req.body, user: req.uid },
      { new: true }
    );

    if (evento.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        status: "error",
        msg: "No tiene privilegios para editar este evento",
      });
    }

    res.status(200).json({
      updateEvent: id,
      ok: true,
      status: "ok",
      msg: "updateEvents",
      evento: newDataEvent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      status: "error",
      msg: "Hable con el administrador",
    });
  }
};

const deleteEvents = async (req, res = response) => {
  const { id } = req.params;

  try {
    const evento = await Evento.findById(id);

    if (!evento) {
      return res.status(404).json({
        ok: false,
        status: "error",
        msg: "Evento no encontrado por id",
      });
    }
    const newDataEvent = await Evento.findByIdAndDelete(id);

    if (evento.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        status: "error",
        msg: "No tiene privilegios para borrar este evento",
      });
    }

    res.json({
      deleteEvent: id,
      ok: true,
      status: "ok",
      msg: "deleteEvents",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      status: "error",
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getEvents,
  createEvents,
  updateEvents,
  deleteEvents,
};
