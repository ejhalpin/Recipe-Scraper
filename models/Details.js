var mongoose = require("mongoose");

var Detail = mongoose.model(
  "Detail",
  new mongoose.Schema({
    ingredients: {
      type: [String]
    },
    step: {
      type: [String]
    }
  })
);

module.exports = Detail;