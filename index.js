require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dbConfig = require("./config/database-config.js");
const initializeDB = require("./app/scripts/initialize-db.js");
const scheduler = require("./app/services/sync-scheduler.js");
const logger = require("./app/services/logger.js")

function logRequest(req, res, next) {
  logger.info(req.url)
  next()
}

function logError(err, req, res, next) {
  logger.error(err)
  next()
}

app.use(logRequest)
app.use(logError)
app.use(express.json());

mongoose.connect(dbConfig.url, dbConfig.options);
const database = mongoose.connection;
database.on("error", (error) => {
  logger.error("Could not connect to the database. Exiting now...", error);
  process.exit();
});

database.once("connected", () => {
  logger.info("Successfully connected to the database");
});

initializeDB.importDB(database);
initializeDB.firstRecord();
scheduler.syncDB(database);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  //http://localhost:3000/cvedetails/CVE-2017-0001
  logger.info(`Server is running and listening on port ${PORT}.`)
);
