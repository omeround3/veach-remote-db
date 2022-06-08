const nvd = require("../constants/nvdapi.js");
const CPEMeta = require("../models/cpemeta.js");
// const dbConfig = require("../../config/database-config.js");
const https = require("https");
const logger = require("./logger.js");
const updateCVEDetails = require("./cpe-import.js").updateCPEDetails;
const schedule = require("node-schedule");

function syncCVE() {
  // Set the scheduler to synchronize with nist db 0 */2 * * *
  // schedule.scheduleJob('*/15 * * * *', async () => {
  schedule.scheduleJob("*/10 * * * * *", async () => {
    logger.info(
      `[CVE SYNC JOB] Running scheduled CVE Sync Job | Current Date() => ${new Date()}`
    );
    try {
      let metaDate = ""
      let record = await CVEMeta.findOne();
      logger.debug(`[CVE SYNC JOB] Current CVE Meta Date  => ${record.lastModifiedDate}`);
      await getCVEfeedModifiedDate()
        .then((res) => {
          metaDate = parseDatefromMetaFeed(res.body);
          logger.debug(`[CVE SYNC JOB] CVE Modified Meta Feed Date: ${metaDate}`);
        })
        .catch((err) => {
          logger.error(`[CVE SYNC JOB] Failed getting CVE Modified Meta feed with error: ${err}`);
        });
      if (isCVEmodifiedFeedChanged(record.lastModifiedDate, metaDate)) {
        logger.info(
          "[CVE SYNC JOB] Modified feed date is newer, updating the database"
        );
        var modifiedUrl = nvd.CVE_MODIFIED_URL + nvd.FEED_TYPE;
        await updateCVEDetails(modifiedUrl);
        record.lastModifiedDate = metaDate;
        record.save().then(() => {
          logger.debug(`[CVE SYNC JOB] Saved updated CVE Meta`);
        });
      } else {
        logger.info(
          "[CVE SYNC JOB] No changes detected in remote modified feed"
        );
      }
    } catch (error) {
      logger.error(`[CVE SYNC JOB] Job Failed with error: ${error}`);
    }
    logger.info("[CVE SYNC JOB] Finished scheduled CVE Sync Job");
  });
}

async function getCVEfeedModifiedDate() {
  return new Promise((resolve, reject) => {
    let modifiedMetaUrl = nvd.CVE_MODIFIED_URL + nvd.META_TYPE;
    const req = https.get(modifiedMetaUrl, (res) => {
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

function isCVEmodifiedFeedChanged(currentDate, metaDate) {
  return currentDate.getTime() < metaDate.getTime();
}

function parseDatefromMetaFeed(rawData) {
  const parsedDate = rawData.substring(17, 42);
  return new Date(parsedDate);
}

module.exports = {
  syncCVE,
};
