const faker = require("faker");
const { hash } = require("bcryptjs");

const User = require("./src/app/models/User");
const Recipe = require("./src/app/models/Recipe");
const Chef = require("./src/app/models/Chef");
const File = require("./src/app/models/File");

let usersIds = [];
let recipesIds = [];
let chefsIds = [];
let filesIds = [];

let totalUsers = 4;
let totalRecipes = 10;
let totalChefs = 6;

async function createUsers() {
  try {
    const users = [];
    const password = await hash("1111", 8);

    while (users.length < totalUsers) {
      users.push({
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password,
        is_admin: Math.round(Math.random()),
      });
    }

    const usersPromise = users.map((user) => User.create(user));

    usersIds = await Promise.all(usersPromise);
  } catch (error) {
    console.error(error);
  }
}

async function createChefs() {
  try {
    let chefs = [];
    let files = [];

    while (files.length < totalChefs) {
      files.push({
        name: faker.image.image(),
        path: `public/assets/chef.svg`,
      });
    }

    const filesPromise = files.map((file) => File.createChefFile(file));
    filesIds = await Promise.all(filesPromise);

    while (chefs.length < totalChefs) {
      chefs.push({
        name: faker.name.firstName(),
        file_id: filesIds[Math.floor(Math.random() * totalChefs)],
      });
    }
    const chefsPromise = chefs.map((chef) => Chef.create(chef));

    chefsIds = await Promise.all(chefsPromise);
  } catch (error) {
    console.log(error);
  }
}

async function createRecipes() {
  try {
    let recipes = [];

    let preparation = faker.lorem
      .sentences(Math.ceil(Math.random() * 5))
      .split(". ");
    preparationremoved = preparation.pop();

    let ingredients = faker.lorem
      .words(Math.ceil(Math.random() * 10))
      .split(" ");

    while (recipes.length < totalRecipes) {
      recipes.push({
        chef_id: chefsIds[Math.floor(Math.random() * totalChefs)],
        title: faker.name.title(),
        ingredients,
        preparation,
        information: faker.lorem.paragraph(Math.ceil(Math.random() * 4)),
        user_id: usersIds[Math.floor(Math.random() * totalUsers)],
      });
    }

    const recipesPromise = recipes.map((recipe) => Recipe.create(recipe));
    recipesIds = await Promise.all(recipesPromise);

    let files = [];
    while (files.length < 3 * totalRecipes) {
      files.push({
        name: faker.image.image(),
        path: `public/assets/recipe.svg`,
      });
    }
    const filesPromise = files.map((file) =>
      File.createRecipeFiles({
        ...file,
        recipe_id: recipesIds[Math.floor(Math.random() * totalRecipes)],
      })
    );
    await Promise.all(filesPromise);
  } catch (error) {
    console.error(error);
  }
}

async function init() {
  await createUsers();
  console.log("users ok");
  await createChefs();
  console.log("chefs ok");
  await createRecipes();
  console.log("recipes ok");
}

init();
