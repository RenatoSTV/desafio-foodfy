const Recipe = require("../models/Recipe");
const File = require("../models/File");
const Chef = require("../models/Chef");

module.exports = {
  //index
  async index(req, res) {
    try {
      let results = await Recipe.all();
      const recipes = results.rows;

      if (!recipes) return res.send("Recipes not found");

      async function getImage(recipeId) {
        let results = await Recipe.files(recipeId);
        const files = results.rows.map(
          (file) =>
            `${req.protocol}://${req.headers.host}${file.path.replace(
              "public\\images\\",
              "\\\\images\\\\"
            )}`
        );

        return files[0];
      }

      const recipesPromise = recipes.map(async (recipe) => {
        recipe.img = await getImage(recipe.id);
        return recipe;
      });

      const lastAdded = await Promise.all(recipesPromise);

      return res.render("admin/recipes/index", { recipes: lastAdded });
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

      let results = await Recipe.find(req.params.id);
      const recipe = results.rows[0];

      if (!recipe) return res.send("Recipe not found!");

      results = await Recipe.files(recipe.id);

      const files = results.rows.map((file) => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace(
          "public",
          ""
        )}`,
      }));

      return res.render("admin/recipes/show", { recipe, files, error, loggedId });
    } catch (error) {
      console.error(error);
    }
  },

  //create
  create(req, res) {
    try {
      Chef.all()
        .then(function (results) {
          const chefs = results.rows;

          return res.render("admin/recipes/create", { chefs });
        })
        .catch(function (err) {
          throw new Error(err);
        });
    } catch (error) {
      console.error(error);
    }
  },

  //post
  async post(req, res) {
    try {
      const keys = Object.keys(req.body);

      const userId = req.session.userId;

      for (key of keys) {
        if (req.body[key] == "") {
          return res.send("Please, fill all fields");
        }
      }

      if (req.files.length == 0)
        return res.send("Please, send at least one image.");

      let results = await Recipe.create(req.body, userId);
      const RecipeId = results.rows[0].id;

      const filesPromise = req.files.map((file) =>
        File.createRecipeFiles({ ...file, recipe_id: RecipeId })
      );
      await Promise.all(filesPromise);

      return res.redirect(`/admin/recipes/`);
    } catch (error) {
      console.error(error);
    }
  },
  //edit
  async edit(req, res) {
    try {
      let results = await Recipe.find(req.params.id);
      const recipe = results.rows[0];

      if (!recipe) return res.send("Recipe not found!");

      results = await Chef.all();
      const chefs = results.rows;

      results = await Recipe.files(recipe.id);
      let files = results.rows;
      files = files.map((file) => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace(
          "public",
          ""
        )}`,
      }));

      return res.render("admin/recipes/edit", { recipe, chefs, files });
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

      await Recipe.put(req.body);

      return res.redirect(`/admin/recipes/`);
    } catch (error) {
      console.error(error);
    }
  },

  //delete
  async delete(req, res) {
    try {
      await Recipe.delete(req.body.id);

      return res.redirect("/admin/recipes");
    } catch (error) {
      console.error(error);
    }
  },
};
