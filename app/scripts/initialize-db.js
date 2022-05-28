const nvd = require("../constants/nvdapi.js");
const dbConfig = require("../../config/database-config.js");
const importCVEDetails = require("../services/cve-import.js").importCVEDetails;

// Import data from NIST for years provided in cmd line args

function importDB(connection) {
  var years = process.argv.slice(2);
  var FIRST_YEAR = 2002;
  let currentYear = new Date().getFullYear();
  const yearsRange = [...Array(currentYear - FIRST_YEAR + 1).keys()].map(
    (x) => x + FIRST_YEAR
  );

  const destDBConfig = {
    dbURL: dbConfig.url,
    dbConnection: connection,
    collection: dbConfig.collection,
    batchSize: dbConfig.batchSize,
  };

  // Import files from NVD by years provided as cmd arguments or all years until today
  if (years.length > 0) {
    console.log("Importing JSON feeds from NVD for the years: " + years);
    for (var i = 0; i < years.length; i++) {
      var url = nvd.DATA_FEED + years[i] + nvd.FEED_TYPE;
      console.log("Importing " + years[i]);
      importCVEDetails(url, destDBConfig);
    }
  } else {
    console.log(
      `Importing JSON feeds from NVD for the years ${yearsRange[0]} - ${
        yearsRange[yearsRange.length - 1]
      }`
    );

    for (const year in yearsRange) {
      console.log(`Importing year ${yearsRange[year]}`);
      var url = nvd.DATA_FEED + yearsRange[year] + nvd.FEED_TYPE;
      importCVEDetails(url, destDBConfig, yearsRange[year]);
    }
  }
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
} 

async function firstRecord() {
  const CVEMeta = require("../models/cvemeta.js");

  const handleError = function (err) {
    console.error(err);
    // handle your error
  };

  var id;
  var firstRec = new CVEMeta({ lastModifiedDate: new Date() });
  firstRec.save(function (err, record) {
    if (err) return handleError(err);
    id = record._id;
  });

  await delay(2000)
  CVEMeta.findById(id, (err, record) => {
    if (err) {
      console.log(err);
    } else {
      console.log("First Record:", record);
    }
  });
}

module.exports = {
  importDB,
  firstRecord,
};
