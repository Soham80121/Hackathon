const mongoose = require("mongoose");

const statSchema = new mongoose.Schema({
  aiQueries: {
    type: Number,
    default: 0,
  },
  pendingLeaves: {
    type: Number,
    default: 0,
  }
});

module.exports = mongoose.model("Stat", statSchema);
