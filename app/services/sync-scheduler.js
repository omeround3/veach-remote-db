// const through2Batch = require('through2-batch');
const CVEMeta = require("./app/models/cvemeta.js");
const schedule = require("node-schedule");

// Set the scheduler to synchronize with nist db 0 */2 * * *
// var j = schedule.scheduleJob('* * * * *', () => {
//   var remoteLastModified = new Date();
//   CVEMeta.findOne().then(record => {
//     console.log(record);
//     // if(meta.lastModifiedDate != remoteLastModified) {
//     //   var modifiedUrl = 'https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-modified.json.gz';
//     //   importCVEDetails(modifiedUrl, destDBConfig);
//     //   meta.lastModifiedDate = remoteLastModified;
//     //   meta.save();
//     // }
//   });
// });
