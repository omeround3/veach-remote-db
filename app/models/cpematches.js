const mongoose = require("mongoose");

const CPEMatchesSchema = mongoose.Schema({
  _id: String,
});

module.exports = mongoose.model("CPEMatches", CPEMatchesSchema);
