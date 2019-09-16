var mongoose = require("mongoose");

var Detail = mongoose.model(
  "Detail",
  new mongoose.Schema({
    ingredients: {
      type: [String]
    },
    steps: {
      type: [String]
    },
    times: {
      type: [String]
    }
  })
);

module.exports = Detail;
