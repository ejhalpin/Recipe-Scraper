//pull in the database models
var db = require("../models");
console.log(db);
//Pull in axios for server-side http requests and cheerio for scraping
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

module.exports = function(app) {
  app.get("/", (req, res) => {
    db.Recipe.find({}, function(error, recipes) {
      // Throw any errors to the console
      if (error) {
        console.log(error);
      }
      // If there are no errors, send the data to the browser as json
      else {
        res.render("index", { recipes: recipes, result: recipes.length > 0, saved: false });
      }
    });
  });
  app.get("/scrape", (req, res) => {
    //scrape allrecipes.com and get the featured recipes
    axios.get("https://www.allrecipes.com/").then(function(response) {
      // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      var $ = cheerio.load(response.data);

      // Select each element in the HTML body from which you want information.
      // NOTE: Cheerio selectors function similarly to jQuery's selectors,
      // but be sure to visit the package's npm page to see how it works

      $("article").each(function(i, element) {
        var title = $(element)
          .find("div.fixed-recipe-card__info")
          .find("h3")
          .text()
          .trim();
        if (title.length === 0) {
          return;
        }
        var link = $(element)
          .find("div.fixed-recipe-card__info")
          .find("a")
          .attr("href");
        var img = $(element)
          .find("div.grid-card-image-container")
          .find("a")
          .find("img")
          .attr("data-original-src");
        var rating = $(element)
          .find("div.fixed-recipe-card__info")
          .children("a")
          .children("div.fixed-recipe-card__ratings")
          .children("span.stars")
          .attr("aria-label");
        db.Recipe.create({
          title: title,
          link: link,
          img: img,
          rating: rating
        });
      });
      res.send();
    });
  });

  app.get("/save/:id", (req, res) => {
    console.log(req.params.id);
    db.Recipe.findById(req.params.id, function(err, recipe) {
      if (err) {
        console.log(err);
      }
      var copy = {
        title: recipe.title,
        link: recipe.link,
        img: recipe.img,
        rating: recipe.rating
      };
      db.savedRecipe.create(copy, function(err, savedRecipe) {
        db.Recipe.deleteOne({ _id: recipe._id }, function(err) {
          if (err) {
            res.json(err);
          } else {
            res.json(savedRecipe);
          }
        });
      });
    });
  });

  app.get("/delete/:id", (req, res) => {
    db.savedRecipe.findById(req.params.id, function(err, recipe) {
      if (err) {
        res.json(err);
      } else {
        db.savedRecipe.deleteOne({ _id: recipe._id }, function(err) {
          if (err) {
            res.json(err);
          } else {
            res.send();
          }
        });
      }
    });
  });

  app.get("/clear/:model", (req, res) => {
    switch (req.params.model) {
      case "recipes":
        console.log("clearing recipes");
        db.Recipe.deleteMany({}, function(err) {
          if (err) {
            res.json({ err: err });
          } else {
            res.redirect("/");
          }
        });
        break;

      case "saved":
        console.log("clearing saved recipes");
        db.savedRecipe.deleteMany({}, function(err) {
          if (err) {
            res.json(err);
          } else {
            res.send();
          }
        });
    }
  });

  app.get("/saved", (req, res) => {
    db.savedRecipe
      .find({})
      .populate("notes")
      .then(function(recipes) {
        // If there are no errors, send the data to the browser as json
        console.log(recipes);
        res.render("index", { recipes: recipes, result: recipes.length > 0, saved: true });
      })
      .catch(err => {
        res.json(err);
      });
  });
};
