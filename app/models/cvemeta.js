const mongoose = require('mongoose');

const CVEMetaSchema = mongoose.Schema({
    lastModifiedDate: Date,
});

module.exports = mongoose.model('CVEMeta', CVEMetaSchema);
