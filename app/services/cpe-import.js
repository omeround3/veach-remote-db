const https = require("https");
const JSONStream = require("JSONStream");
const zlib = require("zlib");
const es = require("event-stream");
const streamToMongoDB = require("stream-to-mongo-db").streamToMongoDB;
const logger = require("./logger.js");

async function importCPEmatches(url, destDBConfig) {
  logger.info("Downloading CPEs feed");
  var options = {
    rejectUnauthorized: false,
  };
  await https.get(url, options, (response) => {
    response
      .pipe(zlib.createGunzip())
      .pipe(JSONStream.parse("matches.*"))
      .pipe(
        es.map(function (doc, callback) {
          var versionInfo = "";
          if ("versionStartExcluding" in doc) {
            versionInfo += doc.versionStartExcluding + "_VSE";
          }
          if ("versionStartIncluding" in doc) {
            versionInfo += doc.versionStartIncluding + "_VSI";
          }

          if ("versionEndExcluding" in doc) {
            versionInfo += doc.versionEndExcluding + "_VEE";
          }
          if ("versionEndIncluding" in doc) {
            versionInfo += doc.versionEndIncluding + "_VEI";
          }
          doc._id = doc.cpe23Uri + versionInfo;
          callback(null, doc);
        })
      )
      .pipe(streamToMongoDB(destDBConfig))
      .on("finish", () => {
        logger.info("Done importing CPEs matches JSON feeds");
      });
  });
}
module.exports = {
  importCPEmatches,
};
