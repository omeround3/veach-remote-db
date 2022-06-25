const logger = require("../services/logger.js");
const nvd = require("../constants/nvdapi.js");

async function validateCVECollection(_connection) {
    return new Promise(async(resolve, reject) => {
        await _connection.db
          .listCollections({ name: nvd.CVE_COLLECTION_NAME })
          .next(function (err, collection) {
            if (err) {
              logger.error(`[VALIDATION] ${err}`);
              reject(new Error(`Failed to list CVE details collection with error: ${err}`));
            } else if (collection) {
              if (collection.name === nvd.CVE_COLLECTION_NAME) {
                logger.debug(
                  `[VALIDATION] ${nvd.CVE_COLLECTION_NAME} collection exists`
                );
                resolve(true);
              }
            } else {
              logger.debug(
                `[VALIDATION] ${nvd.CVE_COLLECTION_NAME} collection doesn't exists`
              );
              resolve(false);
            }
          });
        });
}

async function validateCPECollection(_connection) {
    return new Promise(async(resolve, reject) => {
        await _connection.db
          .listCollections({ name: nvd.CPE_COLLECTION_NAME })
          .next(function (err, collection) {
            if (err) {
              logger.error(`[VALIDATION] ${err}`);
              reject(new Error(`Failed to list CPE matches collection with error: ${err}`));
            } else if (collection) {
              if (collection.name === nvd.CPE_COLLECTION_NAME) {
                logger.debug(
                  `[VALIDATION] ${nvd.CPE_COLLECTION_NAME} collection exists`
                );
                resolve(true);
              }
            } else {
              logger.debug(
                `[VALIDATION] ${nvd.CPE_COLLECTION_NAME} collection doesn't exists`
              );
              resolve(false);
            }
          });
        });
}

module.exports = async function validateCollections(connection) {
  let isExistCVE = await validateCVECollection(connection),
    isExistCPE = await validateCPECollection(connection);
  return { isExistCVE, isExistCPE };
};
