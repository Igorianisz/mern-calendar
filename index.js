const express = require("express");
const dbconnection = require("./database/config");
const cors = require("cors");
require("dotenv").config();

const app = express();
dbconnection();

app.use(cors());
app.use(express.static("public"));

app.use(express.json());

app.use("/api/auth", require("./src/auth/auth"));
app.use("/api/events", require("./src/events/events"));

app.listen(process.env.PORT, () => {
  console.log(`servidor corriendo en ${process.env.PORT}`);
});