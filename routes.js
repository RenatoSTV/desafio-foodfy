
const express = require('express')
const routes = express.Router()
const recipes = require('./recipes')

routes.get("/", function (req, res) {
    return res.redirect("/admin/recipes")
})

routes.get("/admin/recipes", recipes.index); // Mostrar a lista de receitas -== RECEBE recipes.njk ==-
routes.get("/admin/recipes/create", recipes.create); // Mostrar formulário de nova receita -== RECEBE create.njk ==-
// routes.get("/admin/recipes/:id", recipes.show); // Exibir detalhes de uma  -== RECEBE recipe.njk ==-
//routes.get("/admin/recipes/:id/edit", recipes.edit); // Mostrar formulário de edição de receita -== RECEBE edit.njk ==-

routes.post("/admin/recipes", recipes.post); // Cadastrar nova receita -== RECEBE create.njk ==-
// routes.put("/admin/recipes", recipes.put); // Editar uma receita -== RECEBE edit.njk ==-
// routes.delete("/admin/recipes", recipes.delete); // Deletar uma receita -== RECEBE edit.njk ==-


module.exports = routes