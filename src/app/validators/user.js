const User = require('../models/User')
const { compare } = require('bcryptjs')

function checkAllFields(body) {
    const keys = Object.keys(body)

    for (key of keys) {
        if (body[key] == "" && key != "removed_files") {
            return {
                user: body,
                error: 'Por favor, preencha todos os campos.'
            }
        }
    }
}

async function show(req, res, next) {
    const { userId: id } = req.session

    const user = await User.findOne({ where: { id } })

    if (!user) return res.render("user/register", {
        error: "Usuário não encontrado!"
    })

    req.user = user

    next()
}

async function edit(req, res, next) {
    const id = req.params.id

    const user = await User.findOne({ where: { id } })

    if (!user) return res.render("user/register", {
        error: "Usuário não encontrado!"
    })

    req.user = user

    next()
}

async function post(req, res, next) {
    //check if user exists [email,cpf_cnpj]
    let { email, is_admin } = req.body

    if (is_admin === undefined) {
        is_admin = "false"
    } else {
        is_admin = "true"
    }

    console.log(is_admin)
    const user = await User.findOne({
        where: { email },
    })

    if (user) return res.render('user/register', {
        user: req.body,
        error: 'Usuário já cadastrado.'
    })

    next()
}

async function update(req, res, next) {

    // has password
    const { id, password } = req.body

    if (!password) return res.render("user/index", {
        user: req.body,
        error: "Coloque sua senha para atualizar seu cadastro."
    })

    // password match
    const user = await User.findOne({ where: { id } })

    const passed = await compare(password, user.password)

    if (!passed) return res.render("user/index", {
        user: req.body,
        error: "Senha incorreta."
    })

    req.user = user

    next()
}

module.exports = {
    post,
    show,
    edit,
    update
}