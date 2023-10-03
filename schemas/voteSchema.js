const mongoose = require("mongoose");
const voteSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  img_name: {
    type: String,
  },
  deviceIdentifiers: {
    type: [String],
    required: true,
  },
});

module.exports = voteSchema;
