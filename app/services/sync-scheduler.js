const nvd = require("../constants/nvdapi.js");
const CVEMeta = require("../models/cvemeta.js");
// const dbConfig = require("../../config/database-config.js");
const schedule = require("node-schedule");
const updateCVEDetails = require("./cve-import.js").updateCVEDetails;
const logger = require("./logger.js");

function syncCVE() {
    // Set the scheduler to synchronize with nist db 0 */2 * * *
    schedule.scheduleJob('*/15 * * * *', async () => {
        logger.info("[JOB] Running scheduled CVE Updater Job...");
        var remoteLastModified = new Date();
        await CVEMeta.findOne().then(record => {
        logger.info(record);
        if(record.lastModifiedDate != remoteLastModified) {
            logger.info("[JOB] Modified feed date is newer, updating the database");
            var modifiedUrl = nvd.MODIFIED_URL + nvd.FEED_TYPE;
            updateCVEDetails(modifiedUrl);
            record.lastModifiedDate = remoteLastModified;
            await record.save().then(() => {
                logger.debug(`[JOB] Saved updated CVE Meta`)
            });
        }
        });
        logger.info("[JOB] Finished scheduled CVE Updater Job");
    });
}


module.exports = {
    syncCVE,
  };