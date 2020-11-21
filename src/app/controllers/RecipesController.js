const Recipe = require("../models/Recipe");
const File = require("../models/File");
const Chef = require("../models/Chef");
const fs = require("fs");

const LoadRecipeService = require("../services/LoadRecipeServices");

module.exports = {
  //index
  async index(req, res) {
    try {
      const userId = req.session.userId;

      if (req.session.isAdmin) {
        let recipes = await LoadRecipeService.load("recipes");

        return res.render("admin/recipes/index", { recipes });
      }

      let recipes = await LoadRecipeService.load("recipes", {
        where: { user_id: userId },
      });

      return res.render("admin/recipes/index", { recipes });
    } catch (error) {
      console.error(error);
    }
  },

  //show
  async show(req, res) {
    try {
      const error = req.session.error;
      req.session.error = "";
      const loggedId = req.session.userId;

      const id = req.params.id;

      let recipe = await LoadRecipeService.load("recipe", { where: { id } });

      if (!recipe) return res.send("Recipe not found!");

      return res.render("admin/recipes/show", {
        recipe,
        error,
        loggedId,
      });
    } catch (error) {
      console.error(error);
    }
  },

  //create
  async create(req, res) {
    try {
      const chefs = await Chef.findAll();
      return res.render("admin/recipes/create", { chefs });
    } catch (error) {
      console.error(error);
    }
  },

  //post
  async post(req, res) {
    try {
      const keys = Object.keys(req.body);

      for (key of keys) {
        if (req.body[key] == "") {
          return res.send("Please, fill all fields");
        }
      }

      if (req.files.length == 0)
        return res.send("Please, send at least one image.");

      const recipeId = await Recipe.create({
        chef_id: req.body.chef,
        title: req.body.title,
        ingredients: req.body.ingredients,
        preparation: req.body.preparation,
        information: req.body.information,
        user_id: req.session.userId,
      });

      const filesPromise = req.files.map((file) =>
        File.createRecipeFiles({
          name: file.filename,
          path: file.path,
          recipe_id: recipeId,
        })
      );
      await Promise.all(filesPromise);

      return res.redirect(`/admin/recipes/${recipeId}`);
    } catch (error) {
      console.error(error);
    }
  },
  //edit
  async edit(req, res) {
    try {
      const id = req.params.id;

      let recipe = await LoadRecipeService.load("recipe", { where: { id } });

      let chefs = await Chef.findAll();

      return res.render("admin/recipes/edit", { recipe, chefs });
    } catch (error) {
      console.error(error);
    }
  },

  //put
  async put(req, res) {
    try {
      const keys = Object.keys(req.body);

      for (key of keys) {
        if (req.body[key] == "" && key != "removed_files") {
          return res.send("Please, fill all fields!");
        }
      }

      if (req.files.length != 0) {
        const newFilesPromise = req.files.map((file) =>
          File.createRecipeFiles({ ...file, recipe_id: req.body.id })
        );
        await Promise.all(newFilesPromise);
      }

      if (req.body.removed_files) {
        const removedFiles = req.body.removed_files.split(",");
        const lastIndex = removedFiles.length - 1;
        removedFiles.splice(lastIndex, 1);

        const removedFilesPromise = removedFiles.map((id) =>
          File.deleteFromRecipeFiles(id)
        );

        await Promise.all(removedFilesPromise);
      }
      const id = req.body.id
      let values = {
        title:req.body.title,
        chef_id: req.body.chef,
        ingredients: req.body.ingredients,
        preparation: req.body.preparation,
        information: req.body.information
      }
      await Recipe.update(id, values);

      return res.redirect(`/admin/recipes/`);
    } catch (error) {
      console.error(error);
    }
  },

  //delete
  async delete(req, res) {
    try {
      let promiseResults = await Recipe.files(req.body.id)
      console.log(promiseResults)
      promiseResults.map((file) => {
          try {
            fs.unlinkSync(file.path);
          } catch (error) {
            console.error(error);
          }
      });
      Recipe.delete(req.body.id);

      return res.redirect("/admin/recipes");
    } catch (error) {
      console.error(error);
    }
  },
};
