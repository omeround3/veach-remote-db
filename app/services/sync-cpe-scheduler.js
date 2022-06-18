const nvd = require("../constants/nvdapi.js");
const SyncMeta = require("../models/sync-meta.js");
// const dbConfig = require("../../config/database-config.js");
const https = require("https");
const logger = require("./logger.js");
const initializeDB = require("../scripts/initialize-db.js");
const schedule = require("node-schedule");

function syncCPE(connection) {
  // Set the scheduler to synchronize with NIST NVD feeds 0 */2 * * *
  schedule.scheduleJob("0 3 * * *", async () => {
    logger.info(
      `[CPE SYNC JOB] Running scheduled CPE Sync Job | Current Date() => ${new Date()}`
    );
    try {
      let metaDate = "";
      let record = await SyncMeta.findOne({ type: "CPE" });
      logger.debug(
        `[CPE SYNC JOB] Current CPE Meta Date  => ${record.lastModifiedDate}`
      );
      await getCPEfeedModifiedDate()
        .then((res) => {
          metaDate = parseDatefromMetaFeed(res.body);
          logger.debug(`[CPE SYNC JOB] CPE Modified Meta Feed Date: ${metaDate}`);
        })
        .catch((err) => {
          logger.error(
            `[CPE SYNC JOB] Failed getting CPE Modified Meta feed with error: ${err}`
          );
        });
      if (isCPEmodifiedFeedChanged(record.lastModifiedDate, metaDate)) {
        logger.info(
          "[CPE SYNC JOB] Modified feed date is newer, updating the database"
        );
        await initializeDB.importCPE(connection, true);
        await dropCPEMatches(connection);
        await renameUpdatedCPEMatches(connection);
        record.lastModifiedDate = new Date();
        record.save().then(() => {
          logger.debug(`[CPE SYNC JOB] Updated CPE Sync Meta`);
        });
      } else {
        logger.info(
          "[CPE SYNC JOB] No changes detected in remote modified feed"
        );
      }
      logger.info("[CPE SYNC JOB] Finished scheduled CPE Sync Job");
    } catch (error) {
      logger.error(`[CPE SYNC JOB] Job Failed with error: ${error}`);
    }
  });
}

async function dropCPEMatches(connection) {
  return new Promise((resolve, reject) => {
    try {
      logger.info("[CPE SYNC JOB] Dropping CPEs matches collection");
      connection.db.dropCollection("cpematches", function (err, result) {
        if (err) {
          logger.error("[CPE SYNC JOB] Failed to drop CPEs matches collection");
        } else {
          logger.info(
            "[CPE SYNC JOB] Dropped CPEs Matches collection successfully"
          );
          resolve();
        }
      });
    } catch (error) {
      logger.error(
        `[CPE SYNC JOB] Failed to sync CPE matches feed with error: ${error}`
      );
      reject(new Error(`Failed to drop CPE matches collection`));
    }
  });
}

async function renameUpdatedCPEMatches(connection) {
  return new Promise((resolve, reject) => {
    try {
      logger.info("[CPE SYNC JOB] Renaming updated CPEs matches collection");
      connection.db.collection("cpematchesupdated").rename("cpematches");
      logger.info("[CPE SYNC JOB] Renamed updated CPEs matches collection successfully");
      resolve();
    } catch (error) {
      logger.error(
        `[CPE SYNC JOB] Failed to rename updated CPE matches collection with error: ${error}`
      );
      reject(new Error(`Failed to rename updated CPEs matches collection`));
    }
  });
}

async function getCPEfeedModifiedDate() {
  return new Promise((resolve, reject) => {
    let CPEMetaUrl = nvd.CPE_DATA_FEED + nvd.META_TYPE;
    const req = https.get(CPEMetaUrl, (res) => {
      const chunks = [];

      res.on("data", (chunk) => chunks.push(chunk));
      res.on("error", reject);
      res.on("end", () => {
        const { statusCode, headers } = res;
        const validResponse = statusCode >= 200 && statusCode <= 299;
        const body = chunks.join("");

        if (validResponse) resolve({ statusCode, headers, body });
        else
          reject(
            new Error(`Request failed. status: ${statusCode}, body: ${body}`)
          );
      });
    });
    req.on("error", reject);
    req.end();
  });
}

function isCPEmodifiedFeedChanged(currentDate, metaDate) {
  return currentDate.getTime() < metaDate.getTime();
}

function parseDatefromMetaFeed(rawData) {
  const parsedDate = rawData.substring(17, 42);
  return new Date(parsedDate);
}

module.exports = {
  syncCPE,
};
