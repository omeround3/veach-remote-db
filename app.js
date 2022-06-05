require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dbConfig = require("./config/database-config.js");
const initializeDB = require("./app/scripts/initialize-db.js");
const logger = require("./app/services/logger.js");
const scheduler = require("./app/services/sync-scheduler.js");

function logRequest(req, res, next) {
  logger.info(req.url);
  next();
}

function logError(err, req, res, next) {
  logger.error(err);
  next();
}

app.use(logRequest);
app.use(logError);
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  //http://localhost:3000/cvedetails/CVE-2017-0001
  logger.info(`[SERVER] Server is running and listening on port ${PORT}.`)
);

mongoose.connect(dbConfig.url, dbConfig.options);
const database = mongoose.connection;
database.on("error", (error) => {
  logger.error(
    "[DATABASE] Could not connect to the database. Exiting now...",
    error
  );
  process.exit();
});

database.once("connected", async () => {
  logger.info("[DATABASE] Successfully connected to the database");
  await initializeDB.importCVE(database);
  await initializeDB.firstRecord();
  await initializeDB.importCPE(database);
  // scheduler.syncCVE();
});
