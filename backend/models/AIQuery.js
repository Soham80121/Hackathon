const mongoose = require("mongoose");

const aiQuerySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  responseTime: {
    type: Number,
  }
});

module.exports = mongoose.model("AIQuery", aiQuerySchema);
