const mongoose = require('mongoose');

const CPEMetaSchema = mongoose.Schema({
    lastModifiedDate: Date,
});

module.exports = mongoose.model('CPEMeta', CPEMetaSchema);
