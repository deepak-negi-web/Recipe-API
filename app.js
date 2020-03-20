const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/recipeDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const recipeSchema = new mongoose.Schema({
  genre: String,
  name: String,
  description: String,
  ingredients: [{
    type: String
  }],
  method: [{
    type: String
  }]
});

const Recipe = mongoose.model("Recipe", recipeSchema);

//////////////////////targeting specific recipes/////////////////////////////////////////////////////////

app.route("/recipes")
  .get(function(req, res) {
    Recipe.find(function(err, foundrecipes) {
      if (!err) {
        res.send(foundrecipes);
      } else {
        res.send(err);
      }
    });
  })
  .post(function(req, res) {
    const newRecipe = new Recipe({
      genre: req.body.genre,
      name: req.body.name,
      description: req.body.description,
      ingredients: [req.body.ingredients],
      method: [req.body.method]
    });
    newRecipe.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("successfully added");
      }
    });

  })
  .delete(function(req, res) {
    Recipe.deleteMany(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("successfully deleted all recipes");
      }
    });
  });

//////////////////////targeting specific recipes/////////////////////////////////////////////////////////

app.route("/recipes/:query")
  .get(function(req, res) {
    const query = req.params.query;
    Recipe.findOne({
      name: query
    }, function(err, foundRecipe) {
      if (err) {
        res.send(err);
      } else {
        if (foundRecipe) {
          res.send(foundRecipe);
        } else {
          res.send("No recipe found for that title");
        }
      }
    });
  })
  .put(function(req, res) {
    Recipe.update({
      name: req.params.query
    }, {
      genre: req.body.genre,
      name: req.body.name,
      description: req.body.description,
      ingredients: [req.body.ingredients],
      method: [req.body.method]
    }, {
      overwrite: true
    }, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("successfully updated the recipe mentioned");
      }
    });
  })

  .patch(function(req, res) {
    Recipe.update({
      name: req.params.query
    }, {
      $set: req.body
    }, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("successfully updated the recipe mentioned");
      }
    });
  })

  .delete(function(req, res) {
    Recipe.deleteOne({
      name: req.params.query
    }, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("successfully deleted the mentioned recipes");
      }
    });
  })


app.listen(process.env.PORT || 3000, function() {
  console.log("server has started..");
});