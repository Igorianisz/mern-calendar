const express = require("express");
const router = express.Router();
const { validateJWT } = require("./../middlewares/validate-jwt");
const { check } = require("express-validator");
const { validateFields } = require("./../middlewares/validateField");
const { isDate } = require("./../../helpers/isDate");

const {
  getEvents,
  createEvents,
  updateEvents,
  deleteEvents,
} = require("./eventsController");

router.use(validateJWT);

router.get("/", getEvents);

router.post(
  "/create",
  [
    check("title", "Titulo es obligatorio").notEmpty(),
    check("start", "Fecha nde inicio no es valida").custom(isDate),
    check("end", "Fecha nde fin no es valida").custom(isDate),
    validateFields,
  ],
  createEvents
);

router.put("/update/:id", updateEvents);

router.put("/delete/:id", deleteEvents);

module.exports = router;
