var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

module.exports = function(app) {
  app.get("/", (req, res) => {
    db.Recipe.find({})
      .then(function(recipes) {
        res.render("index", { recipes: recipes, result: recipes.length > 0 });
      })
      .catch(function(err) {
        res.render("error", err);
      });
  });

  app.get("/saved", (req, res) => {
    db.savedRecipe
      .find({})
      .then(function(recipes) {
        res.render("saved", { recipes: recipes, result: recipes.length > 0 });
      })
      .catch(err => {
        res.render("error", err);
      });
  });

  app.get("/details/:id", (req, res) => {
    db.savedRecipe
      .findById(req.params.id)
      .populate("note")
      .populate("detail")
      .then(data => {
        if (!data.detail) {
          console.log("redirecting...");
          res.redirect("/api/details/" + data._id);
        } else {
          console.log(data);
          res.location("/details").render("details", data);
        }
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });
};
