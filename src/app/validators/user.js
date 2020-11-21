const User = require("../models/User");
const { compare } = require("bcryptjs");
const Recipe = require("../models/Recipe");

const LoadRecipeService = require("../services/LoadRecipeServices");

async function show(req, res, next) {
  const {userId: id} = req.session

  const user = await User.findOne({ where: {id} })

  if (!user)
    return res.render("admin/users/register", {
      error: "Usuário não encontrado!",
    });

  req.user = user;

  next();
}

async function edit(req, res, next) {
  const id = req.params.id;

  const user = await User.findOne({ where: { id } });

  if (!user)
    return res.render("user/register", {
      error: "Usuário não encontrado!",
    });

  req.user = user;

  next();
}

async function validate(req, res, next) {
  const id = req.params.id;
  const userId = req.session.userId;

  let recipe = await LoadRecipeService.load("recipe",  { where: { id } });
  if (!recipe) return res.send("Recipe not found!");
  
  function isNotAuthorized() {
    req.session.error = 'Você não tem autorização para fazer auterações nesssa receita!'
    res.redirect(`${req.headers.referer}`)

    return
  }

  recipe.user_id === userId ? next() : req.session.isAdmin ? next() : isNotAuthorized()
}

async function post(req, res, next) {
  //check if user exists [email]
  let { email, is_admin } = req.body;

  if (is_admin === undefined) {
    is_admin = "false";
  } else {
    is_admin = "true";
  }

  const user = await User.findOne({
    where: { email },
  });

  if (user)
    return res.render("admin/users/register", {
      user: req.body,
      error: "Usuário já cadastrado.",
    });

  next();
}

async function update(req, res, next) {
  try {
    // has password
    const { id, password } = req.body;

    if (!password)
      return res.render("admin/users/index", {
        user: req.body,
        error: "Coloque sua senha para atualizar seu cadastro.",
      });

    // password match
    const user = await User.findOne({ where: { id } });

    // const passed = await compare(password, user.password)
    const passed = await compare(password, user.password)

    if (!passed)
      return res.render("admin/users/index", {
        user: req.body,
        error: "Senha incorreta.",
      });

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  post,
  show,
  edit,
  validate,
  update,
};
