# Recipe-Scraper

An Allrecipes Scraper, so you can focus on cooking. That's the tagline, I suppose. This app scrapes the landing page for [allrecipes.com](https://www.allrecipes.com) and fetches the featured recipes that appear there. Users can then save these recipes and further scapre them to fetch ingredients and instructions, effectively bypassing the ads and blogs that often cover up the essential portions of the recipe. Users can also create, update, and delete notes for each saved recipe to aid them in preparing their favorite meals.

## Technology

- node
- express
- express-handlebars
- cheerio
- axios
- mongoose
- bootstrap

## Express Routes

This express app is backed by a Mongo database to store scraped and saved data as well as notes and recipe details. The express server is broken into two routing types. `htmlRoutes`, which only return rendered views, and `apiRoutes`, which only return data.

## Handlebars View

The views, which are returned by the aforementioned `htmlRoutes`, are broken up into three files. `index.handlebars` is the landing page and shows the scraped recipes from the db that have not been saved by a user. `saved.handlebars` renders the saved recipes from the db and shows additional options on each recipe card. Lastly, `details.handlebars` displays additional details for a given recipe, including any user-created notes, recipe ingredients, and instructions (if the further scraping was a success).

# Happy Scraping and Cooking!
