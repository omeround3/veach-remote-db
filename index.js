require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const dbConfig = require("./config/database-config.js");
const initializeDB = require("./app/scripts/initialize-db.js");

app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

initializeDB.importDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  //http://localhost:3000/cvedetails/CVE-2017-0001
  console.log(`Server is running and listening on port ${PORT}.`)
);
