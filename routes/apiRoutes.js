//pull in the database models
var db = require("../models");
console.log(db);
//Pull in axios for server-side http requests and cheerio for scraping
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

module.exports = function(app) {
  app.get("/scrape", (req, res) => {
    //scrape allrecipes.com and get the featured recipes
    axios.get("https://www.allrecipes.com/").then(function(response) {
      var $ = cheerio.load(response.data);
      var recipes = [];
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
        var recipe = {
          title: title,
          link: link,
          img: img,
          rating: rating
        };
        db.Recipe.create(recipe);
        recipes.push(recipe);
      });
      res.json(recipes);
    });
  });

  app.get("/save/:id", (req, res) => {
    db.Recipe.findById(req.params.id, function(err, recipe) {
      if (err) {
        return res.status(500).json(err);
      }
      var copy = {
        title: recipe.title,
        link: recipe.link,
        img: recipe.img,
        rating: recipe.rating
      };
      db.savedRecipe.create(copy, function(err, savedRecipe) {
        if (err) {
          return res.status(500).json(err);
        }
        db.Recipe.deleteOne({ _id: recipe._id }, function(err) {
          if (err) {
            return res.status(500).json(err);
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
        return res.status(500).json(err);
      }
      db.savedRecipe.deleteOne({ _id: recipe._id }, function(err) {
        if (err) {
          return res.status(500).json(err);
        }
        res.send();
      });
    });
  });

  app.get("/clear/:model", (req, res) => {
    switch (req.params.model) {
      case "recipes":
        console.log("clearing recipes");
        db.Recipe.deleteMany({}, function(err) {
          if (err) {
            res.status(500).json(err);
          } else {
            res.redirect("/");
          }
        });
        break;

      case "saved":
        console.log("clearing saved recipes");
        db.savedRecipe.deleteMany({}, function(err) {
          if (err) {
            return res.status(500).json(err);
          }
          res.send();
        });
        break;
    }
  });

  app.get("/api/details/:id", (req, res) => {
    console.log(req.params.id);
    db.savedRecipe
      .findById(req.params.id)
      .then(data => {
        //scrape the recipe...
        axios.get(data.link).then(function(response) {
          var $ = cheerio.load(response.data);
          var ingredients = [];
          var times = [];
          var steps = [];
          //find the ingredients
          $("ul.checklist").each(function(i, element) {
            $(element)
              .children("li")
              .each(function(j, listitems) {
                var li = $(listitems)
                  .children("label")
                  .children("span")
                  .text()
                  .trim();
                if (li.includes("Add all")) {
                  li = "";
                }
                if (li) {
                  ingredients.push(li);
                }
              });
          });
          //find the times
          $("li.prepTime__item").each(function(i, element) {
            var time = $(element).attr("aria-label");
            if (time) {
              times.push(time);
            }
          });
          $("span.recipe-directions__list--item").each(function(i, element) {
            var direction = $(element).text();
            if (direction) {
              steps.push(direction);
            }
          });
          db.Details.create({
            ingredients: ingredients,
            times: times,
            steps: steps
          })
            .then(detail => {
              db.savedRecipe
                .findByIdAndUpdate(req.params.id, { $push: { detail: detail._id } }, { new: true })
                .then(updatedRecipe => {
                  res.redirect("/details/" + updatedRecipe._id);
                })
                .catch(err => {
                  res.json(err);
                });
            })
            .catch(err => {
              res.json(err);
            });
        });
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

  app.post("/api/note/:id", (req, res) => {
    db.Note.create(req.body)
      .then(newNote => {
        console.log(newNote);
        db.savedRecipe
          .findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id) }, { $push: { note: newNote._id } }, { new: true })
          .then(updatedRecipe => {
            console.log("UPDATED RECIPE---------------------------->");
            console.log(updatedRecipe);
            console.log("<_-----------------------------------");
            res.redirect("/details/" + updatedRecipe._id);
          })
          .catch(err => {
            res.status(500).json(err);
          });
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

  app.post("/api/delete/", (req, res) => {
    //first, disassociate the note from savedRecipes....
    db.savedRecipe
      .findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.recipeId) }, { $pull: { note: mongoose.Types.ObjectId(req.body.id) } }, { new: true })
      .then(updatedRecipe => {
        console.log("DELETED REFERENCE!!!--------------------->");
        console.log(updatedRecipe);
        db.Note.deleteOne({ _id: mongoose.Types.ObjectId(req.body.id) })
          .then(data => {
            res.json(data);
          })
          .catch(err => {
            res.status(500).json(err);
          });
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });
};
