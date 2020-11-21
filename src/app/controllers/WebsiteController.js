const Recipe = require("../models/Recipe");
const Chef = require("../models/Chef");

const LoadRecipeService = require("../services/LoadRecipeServices");

module.exports = {
  async index(req, res) {
    try {
      let recipes = await LoadRecipeService.load("recipes");
      return res.render("website/index", { recipes });
    } catch (error) {
      console.log(error);
    }
  },
  about(req, res) {
    return res.render("website/about");
  },

  async recipes(req, res) {
    let { filter, page, limit } = req.query;

    page = page || 1;
    limit = limit || 3;
    let offset = limit * (page - 1);

    const params = {
      filter,
      page,
      limit,
      offset,
    };

    const recipes = await LoadRecipeService.load("recipesPaginate", params)
    if (!recipes) return res.send("Recipes not found");

    let mathTotal =
      recipes[0] == undefined ? 0 : Math.ceil(recipes[0].total / limit);

    const pagination = {
      total: mathTotal,
      page,
    };

    return res.render("website/recipes", {
      recipes,
      pagination,
      filter,
    });
  },

  async chefs(req, res) {
    try {
      let results = await Chef.totalRecipes();

      const chefs = results.rows;

      async function getImage(chefId) {
        let files = await Chef.files(chefId);
        files = files.map((file) => `${file.path.replace("public", "")}`);

        return files[0];
      }

      const chefsPromise = chefs.map(async (chef) => {
        chef.img = await getImage(chef.id);
        return chef;
      });

      const allChefs = await Promise.all(chefsPromise);

      return res.render("website/chefs", { chefs: allChefs });
    } catch (error) {
      console.error(error);
    }
  },

  async recipe(req, res) {
    try {
      const id = req.params.id
      let recipe = await LoadRecipeService.load("recipe", { where: { id } });

      if (!recipe) return res.send("Recipe not found!");

      return res.render("website/recipe", { recipe });
    } catch (error) {
      console.error(error);
    }
  },

  async search(req, res) {
    try {
      let results,
        params = {};

      const { filter } = req.query;

      if (!filter) return res.redirect("/");

      params.filter = filter;

      results = await Recipe.findBy(filter);

      async function getImage(recipeId) {
        let files = await Recipe.files(recipeId);
        files = files.map((file) => `${file.path.replace("public", "")}`);

        return files[0];
      }

      const recipesPromise = results.rows.map(async (recipe) => {
        recipe.img = await getImage(recipe.id);
        return recipe;
      });

      const recipes = await Promise.all(recipesPromise);

      const search = {
        term: req.query.filter,
        total: recipes.length,
      };

      return res.render("website/recipes", { recipes, search, categories });
    } catch (error) {
      console.log(error);
    }
  },
};
