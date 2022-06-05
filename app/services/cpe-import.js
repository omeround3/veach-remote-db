const es = require("event-stream");
const https = require("https");
const JSONStream = require("JSONStream");
const logger = require("./logger.js");
const streamToMongoDB = require("stream-to-mongo-db").streamToMongoDB;
const zlib = require("zlib");

async function importCPEmatches(url, destDBConfig) {
  logger.info("[CPE Event] Downloading CPEs feed");
  // If an TLS certificate issue exists, send the options object as a 2nd parameter to https.get
  // var options = {
  //   rejectUnauthorized: false,
  // };
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
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
        .on("finish", resolve)
        .on("error", reject);
    });
  });
}

module.exports = {
  importCPEmatches,
};
