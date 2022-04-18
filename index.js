const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const https = require("https");
const JSONStream = require('JSONStream');
const zlib = require("zlib")
// const through2Batch = require('through2-batch');
const es = require('event-stream');
const streamToMongoDB = require('stream-to-mongo-db').streamToMongoDB;
const CVEMeta = require('./app/models/cvemeta.model.js');
const schedule = require('node-schedule');

app.use(bodyParser.json());

const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

// Import data from NIST for years provided in cmd line args
const destDBConfig = { dbURL: dbConfig.url, collection: 'cvedetails', batchSize: 500};
var years = process.argv.slice(2);
//Import files from NIST
if (years.length > 0) {
  console.log("Importing JSON feeds from NVD for the years: " + years)
  for(var i=0;i<years.length;i++) {
    var url = 'https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-' + years[i] + '.json.gz';
    console.log("Importing " + years[i])
    importCVEDetails(url, destDBConfig);
  }
}

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
  useNewUrlParser: true
}).then(() => {
  console.log("Successfully connected to the database");
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...', err);
  process.exit();
});

require('./app/routes/cvedetails.routes.js')(app);

const handleError = function(err) {
  console.error(err);
  // handle your error
};

var firstRec = new CVEMeta({ lastModifiedDate: new Date() });
firstRec.save(function (err) {
  if (err) return handleError(err);
});

CVEMeta.findOne({}, (err, record) => {
  console.log(record);
});

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

const PORT = process.env.PORT || 3000;

app.listen(PORT,() =>
  //http://localhost:3000/cvedetails/CVE-2017-0001
  console.log(`Server is running and listening on port ${PORT}.`)
);


function importCVEDetails(url, destDBConfig) {
  // const destDBConfig = { dbURL :dbConfig.url, collection : 'cvedetails', batchSize: 500};
  // const url = 'https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-recent.json.gz';

  https.get(url, response => response
          .pipe(zlib.createGunzip())
          .pipe(JSONStream.parse('CVE_Items.*'))
          .pipe(es.map(function (doc, callback) {
              delete doc.configurations;
              doc._id = doc.cve.CVE_data_meta.ID;
              callback(null, doc)
          }))
          .pipe(streamToMongoDB(destDBConfig))
          // .pipe(through2Batch.obj({ batchSize: 500 }))
          // .pipe(es.mapSync(function(documents){
          //     console.log(documents.length);
          //     cvedetails.insertMany(documents);
          // }))
          .on('end', function () {
              console.log('Done importing CVE JSON Feeds');
          })
  );
}
