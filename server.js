//Pull in express for the server and mongoose for the database
var express = require("express");
var mongoose = require("mongoose");

var app = express();
var PORT = process.env.PORT || 8080;

//Pull in handlebars and configure
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Load middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//set up the connection string
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/recipeScraper";
//Connect to Mongo
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

//pull in routes
require("./routes/apiRoutes")(app);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
