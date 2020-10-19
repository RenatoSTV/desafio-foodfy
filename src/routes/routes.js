const express = require('express')
const routes = express.Router()

// middlewares
const multer = require('../app/middlewares/multer')
const { isLoggedRedirectToProfile, onlyUsers, isAdmin } = require('../app/middlewares/session')

// controllers
const admin = require('../app/controllers/AdminController')
const recipes = require('../app/controllers/RecipesController')
const chefs = require('../app/controllers/ChefsController')
const website = require('../app/controllers/WebsiteController')
const user = require('../app/controllers/UserController')
const profile = require('../app/controllers/ProfileController')
const session = require('../app/controllers/SessionController')

//validators
const SessionValidator = require('../app/validators/session')
const UserValidator = require('../app/validators/user')


//WEBSITE
routes.get("/", website.index)
routes.get("/about", website.about)
routes.get("/recipes", website.recipes)
routes.get("/chefs", website.chefs)
routes.get("/:id", website.recipe)
routes.get("/recipes/?",website.search)

// ADMIN
routes.get("/admin/index",onlyUsers, admin.index); 

//RECIPES
routes.get("/admin/recipes", recipes.index);
routes.get("/admin/recipes/create", recipes.create); // Mostrar formulário de nova receita -== RECEBE create.njk ==-
routes.get("/admin/recipes/:id", recipes.show); // Exibir detalhes de uma receita  -== RECEBE recipe.njk ==-
routes.get("/admin/recipes/:id/edit", UserValidator.validate, recipes.edit); // Mostrar formulário de edição de receita -== RECEBE edit.njk ==-

routes.post("/admin/recipes", multer.array("photos", 5), recipes.post); // Cadastrar nova receita -== RECEBE create.njk ==-
routes.put("/admin/recipes", multer.array("photos", 5), recipes.put); // Editar uma receita -== RECEBE edit.njk ==-
routes.delete("/admin/recipes", recipes.delete); // Deletar uma receita -== RECEBE edit.njk ==-

//CHEFS

routes.get("/admin/chefs", chefs.index);
routes.get("/admin/chefs/create",isAdmin, chefs.create); // Mostrar formulário de novo chef -== RECEBE create.njk ==-
routes.get("/admin/chefs/:id", chefs.show); // Exibir detalhes de um chef -== RECEBE show.njk ==-
routes.get("/admin/chefs/:id/edit",isAdmin, chefs.edit); // Mostrar formulário de edição do chef -== RECEBE edit.njk ==-

routes.post("/admin/chefs", multer.array("photos", 1), chefs.post); // Cadastrar novo chef -== RECEBE create.njk ==-
routes.put("/admin/chefs", multer.array("photos", 1), chefs.put); // Editar um chef -== RECEBE edit.njk ==-
routes.delete("/admin/chefs",isAdmin, chefs.delete); // Deletar um chef -== RECEBE edit.njk ==-

// login/logout
routes.get('/admin/login',isLoggedRedirectToProfile, session.loginForm)
routes.post('/admin/login', SessionValidator.login, session.login)
routes.post('/admin/logout',session.logout)

// reset password / forgot
routes.get('/admin/forgot-password', session.forgotForm)
routes.post('/admin/forgot-password', SessionValidator.forgot, session.forgot)
routes.get('/admin/password-reset', session.resetForm)
routes.post('/admin/password-reset', SessionValidator.reset, session.reset)

// Rotas de perfil de um usuário logado
routes.get('/admin/profile', UserValidator.show, profile.index) // Mostrar o formulário com dados do usuário logado
routes.put('/admin/profile',UserValidator.update, profile.put)// Editar o usuário logado

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/admin/users', user.list) //Mostrar a lista de usuários cadastrados
routes.get('/admin/users/register', isAdmin, user.registerForm) //Mostrar formulário de novo usuários 
routes.post('/admin/users/register', UserValidator.post, user.post) //Cadastrar um usuário
routes.get('/admin/users/:id/edit', isAdmin, UserValidator.edit, user.edit) // Editar um usuário
routes.put('/admin/users', user.update) // Editar um usuário
routes.delete('/admin/users/:id',isAdmin, user.delete) // Deletar um usuário


module.exports = routes