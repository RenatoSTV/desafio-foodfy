const express = require('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer')
const admin = require('./app/controllers/admin')
const recipes = require('./app/controllers/recipes')
const chefs = require('./app/controllers/chefs')
const website = require('./app/controllers/website')


//WEBSITE
routes.get("/", website.index)
routes.get("/about", website.about)
routes.get("/recipes", website.recipes)
routes.get("/chefs", website.chefs)
routes.get("/:id", website.recipe)
routes.get("/recipes/?",website.search)

// ADMIN
routes.get("/admin/index", admin.index); // Mostrar a lista de receitas -== RECEBE recipes.njk ==-

//RECIPES
routes.get("/admin/recipes", recipes.index);
routes.get("/admin/recipes/create", recipes.create); // Mostrar formulário de nova receita -== RECEBE create.njk ==-
routes.get("/admin/recipes/:id", recipes.show); // Exibir detalhes de uma receita  -== RECEBE recipe.njk ==-
routes.get("/admin/recipes/:id/edit", recipes.edit); // Mostrar formulário de edição de receita -== RECEBE edit.njk ==-

routes.post("/admin/recipes", multer.array("photos", 5), recipes.post); // Cadastrar nova receita -== RECEBE create.njk ==-
routes.put("/admin/recipes", multer.array("photos", 5), recipes.put); // Editar uma receita -== RECEBE edit.njk ==-
routes.delete("/admin/recipes", recipes.delete); // Deletar uma receita -== RECEBE edit.njk ==-

//CHEFS

routes.get("/admin/chefs", chefs.index);
routes.get("/admin/chefs/create", chefs.create); // Mostrar formulário de novo chef -== RECEBE create.njk ==-
routes.get("/admin/chefs/:id", chefs.show); // Exibir detalhes de um chef -== RECEBE show.njk ==-
routes.get("/admin/chefs/:id/edit", chefs.edit); // Mostrar formulário de edição do chef -== RECEBE edit.njk ==-

routes.post("/admin/chefs", multer.array("photos", 1), chefs.post); // Cadastrar novo chef -== RECEBE create.njk ==-
routes.put("/admin/chefs", multer.array("photos", 1), chefs.put); // Editar um chef -== RECEBE edit.njk ==-
routes.delete("/admin/chefs", chefs.delete); // Deletar um chef -== RECEBE edit.njk ==-


module.exports = routes