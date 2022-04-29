const nvd = require("../constants/nvdapi.js");
const dbConfig = require("../../config/database-config.js");
const importCVEDetails =
  require("../services/cve-import.js").importCVEDetails;

// Import data from NIST for years provided in cmd line args
const destDBConfig = {
  dbURL: dbConfig.url,
  collection: dbConfig.collection,
  batchSize: dbConfig.batchSize,
};

function importDB() {
  var years = process.argv.slice(2);

  // Import files from NVD by years provided as cmd arguments or all years until today
  if (years.length > 0) {
    console.log("Importing JSON feeds from NVD for the years: " + years);
    for (var i = 0; i < years.length; i++) {
      var url = nvd.DATA_FEED + yearsRange[year] + nvd.IMPORT_TYPE;
      console.log("Importing " + years[i]);
      importCVEDetails(url, destDBConfig);
    }
  } else {
    var FIRST_YEAR = 2002;
    let currentYear = new Date().getFullYear();
    const yearsRange = [...Array(currentYear - FIRST_YEAR + 1).keys()].map(
      (x) => x + FIRST_YEAR
    );
    console.log(
      `Importing JSON feeds from NVD for the years ${yearsRange[0]} - ${
        yearsRange[yearsRange.length - 1]
      }`
    );

    for (const year in yearsRange) {
      console.log(`Importing year ${yearsRange[year]}`);
      var url = nvd.DATA_FEED + yearsRange[year] + nvd.IMPORT_TYPE;
      importCVEDetails(url, destDBConfig);
    }
  }
}

function firstRecord() {
    require("./app/routes/cvedetails.js")(app);

    const handleError = function (err) {
    console.error(err);
    // handle your error
    };

    // var firstRec = new CVEMeta({ lastModifiedDate: new Date() });
    // firstRec.save(function (err) {
    //   if (err) return handleError(err);
    // });

    // CVEMeta.findOne({}, (err, record) => {
    //   console.log(record);
    // });

}
module.exports = {
    importDB,
    firstRecord
}