const mongoose = require("mongoose");

const SyncMetaSchema = mongoose.Schema({
  lastModifiedDate: { type: Date, default: Date.now },
  type: { type: String, enum: ["CVE", "CPE"], required: true, default: "CVE" },
});

module.exports = mongoose.model("SyncMeta", SyncMetaSchema);
