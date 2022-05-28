require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dbConfig = require("./config/database-config.js");
const initializeDB = require("./app/scripts/initialize-db.js");
const scheduler = require("./app/services/sync-scheduler.js");

app.use(express.json());

mongoose.connect(dbConfig.url, dbConfig.options);
const database = mongoose.connection;
database.on("error", (error) => {
  console.log("Could not connect to the database. Exiting now...", error);
  process.exit();
});

database.once("connected", () => {
  console.log("Successfully connected to the database");
});

initializeDB.importDB(database);
initializeDB.firstRecord();
scheduler.syncDB(database);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  //http://localhost:3000/cvedetails/CVE-2017-0001
  console.log(`Server is running and listening on port ${PORT}.`)
);
