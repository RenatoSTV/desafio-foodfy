const Recipe = require("../models/Recipe");
const Chef = require("../models/Chef");
const File = require("../models/File");

async function getImages(recipeId) {
  let files = await Recipe.files(recipeId);
  files = files.map((file) => ({
    ...file,
    src: `${file.path.replace("public", "")}`,
  }));

  return files;
}

async function format(recipe) {
  const files = await getImages(recipe.id);
  const chef = await Chef.findOne({where: { id:recipe.chef_id }})
  recipe.chef = chef.name
  recipe.img = files[0].src;
  recipe.files = files;

  return recipe;
}

const LoadRecipeService = {
  load(service, filter) {
    this.filter = filter;
    return this[service]();
  },
  async recipe() {
    try {
      const recipe = await Recipe.findOne(this.filter);
      return format(recipe);
    } catch (error) {
      console.error(error);
    }
  },
  async recipes() {
    try {
      const recipes = await Recipe.findAll(this.filter);
      const recipesPromise = recipes.map(format);
      return Promise.all(recipesPromise);
    } catch (error) {
      console.error(error);
    }
  },
  async recipesPaginate() {
    try {
      const recipes = await Recipe.paginate(this.filter);
      const recipesPromise = recipes.map(format);
      return Promise.all(recipesPromise);
    } catch (error) {
      console.error(error);
    }
  },
  format,
};

module.exports = LoadRecipeService;
