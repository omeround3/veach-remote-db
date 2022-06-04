// const through2Batch = require('through2-batch');
const nvd = require("../constants/nvdapi.js");
const CVEMeta = require("../models/cvemeta.js");
const dbConfig = require("../../config/database-config.js");
const schedule = require("node-schedule");
const updateCVEDetails = require("./cve-import.js").updateCVEDetails;
const logger = require("./logger.js");

function syncDB(connection) {
    // const destDBConfig = {
    //     dbURL: dbConfig.url,
    //     dbConnection: connection,
    //     collection: dbConfig.collection,
    //     batchSize: dbConfig.batchSize,
    //   };

    // Set the scheduler to synchronize with nist db 0 */2 * * *
    var j = schedule.scheduleJob('*/3 * * * *', () => {
        logger.info("Running scheduled CVE Updater Job...");
        var remoteLastModified = new Date();
        CVEMeta.findOne().then(record => {
        logger.info(record);
        if(record.lastModifiedDate != remoteLastModified) {
            logger.info("Modified feed date is newer, updating the database");
            var modifiedUrl = nvd.MODIFIED_URL + nvd.FEED_TYPE;
            updateCVEDetails(modifiedUrl);
            record.lastModifiedDate = remoteLastModified;
            record.save();
        }
        });
        logger.info("Finished scheduled CVE Updater Job");
    });
}


module.exports = {
    syncDB,
  };