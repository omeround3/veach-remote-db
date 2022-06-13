const dbConfig = require("../../config/database-config.js");
const importCVEDetails = require("../services/cve-import.js").importCVEDetails;
const importCPEmatches = require("../services/cpe-import.js").importCPEmatches;
const nvd = require("../constants/nvdapi.js");
const logger = require("../services/logger.js");

var destDBConfig = {
  dbURL: dbConfig.url,
  dbConnection: "",
  collection: dbConfig.collection,
  batchSize: dbConfig.batchSize,
};

// Delay helper function
function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// Import data from NIST for years provided in cmd line args
async function importCVE(connection) {
  var years = process.argv.slice(2);
  var FIRST_YEAR = 2002;
  let currentYear = new Date().getFullYear();
  const yearsRange = [...Array(currentYear - FIRST_YEAR + 1).keys()].map(
    (x) => x + FIRST_YEAR
  );

  destDBConfig.dbConnection = connection;

  // Import files from NVD by years provided as cmd arguments or all years until today
  if (years.length > 0) {
    logger.info(
      "[CVE] Importing CVE JSON feeds from NVD for the years: " + years
    );
    for (var i = 0; i < years.length; i++) {
      var url = nvd.CVE_DATA_FEED + years[i] + nvd.FEED_TYPE;
      logger.info("[CVE] Importing " + years[i]);
      importCVEDetails(url, destDBConfig);
    }
  } else {
    logger.info(
      `[CVE] Importing CVE JSON feeds from NVD for the years ${
        yearsRange[0]
      } - ${yearsRange[yearsRange.length - 1]}`
    );

    for (const year in yearsRange) {
      logger.info(`[CVE] Importing year ${yearsRange[year]}`);
      url = nvd.CVE_DATA_FEED + yearsRange[year] + nvd.FEED_TYPE;
      await importCVEDetails(url, destDBConfig, yearsRange[year])
        .then(() => {
          logger.info(
            `[CVE] Done importing CVE JSON Feeds - ${yearsRange[year]}`
          );
        })
        .catch((err) => logger.error(err));
      // await delay(500);
    }
    logger.info(
      `[CVE] Done importing CVE JSON feeds from NVD for the years ${
        yearsRange[0]
      } - ${yearsRange[yearsRange.length - 1]}`
    );
  }
}

async function importCPE(connection) {
  logger.info("[CPE] Importing CPEs matches feed");
  destDBConfig.dbConnection = connection;
  destDBConfig.collection = "cpematches";
  var cpeUrl = nvd.CPE_DATA_FEED + nvd.FEED_TYPE;
  await importCPEmatches(cpeUrl, destDBConfig).then(() => {
    logger.info("[CPE] Done importing CPEs matches JSON feeds");
  });
}

async function firstCVEImport() {
  const SyncMeta = require("../models/sync-meta.js");

  const handleError = function (err) {
    logger.error(err);
    // handle your error
  };

  var id;
  var firstRec = new SyncMeta();
  firstRec.save(function (err, record) {
    if (err) return handleError(err);
    id = record._id;
  });

  await delay(2000);
  SyncMeta.findById(id, (err, record) => {
    if (err) {
      logger.error(err);
    } else {
      logger.info(`[SYNC META] First CVE Import: ${record}`);
    }
  });
}

async function firstCPEImport() {
  const SyncMeta = require("../models/sync-meta.js");

  const handleError = function (err) {
    logger.error(err);
    // handle your error
  };

  var id;
  var firstRec = new SyncMeta({ type: "CPE" });
  firstRec.save(function (err, record) {
    if (err) return handleError(err);
    id = record._id;
  });

  await delay(2000);
  SyncMeta.findById(id, (err, record) => {
    if (err) {
      logger.error(err);
    } else {
      logger.info(`[SYNC META] First CPE Import: ${record}`);
    }
  });
}

module.exports = {
  importCVE,
  importCPE,
  firstCVEImport,
  firstCPEImport,
};
