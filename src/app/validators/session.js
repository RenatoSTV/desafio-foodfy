const User = require('../models/User')
const { compare } = require('bcryptjs')

async function login(req, res, next) {

    // veriicar se o usuário está cadastrado
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })
    console.log(user)
    
    if (!user) return res.render("admin/session/login", {
        user: req.body,
        error: "Usuário não cadastrado!"
    })

    // verificar se o password bate
    const passed = await compare(password, user.password)
    // const passed = password === user.password
    if (passed == false) return res.render("admin/session/login", {
        user: req.body,
        error: "Senha incorreta."
    })

    req.user = user

    next()
}

async function forgot(req, res, next) {
    const { email } = req.body

    try {
        let user = await User.findOne({ where: { email } })

        if (!user) return res.render("session/forgot-password", {
            user: req.body,
            error: "Email não cadastrado!"
        })

        req.user = user

        next()
    } catch (error) {
        console.error(error)
    }
}

async function reset(req, res, next) {
    // procurar o usuário
    const { email, password, token, passwordRepeat } = req.body
    console.log(email, password, token, passwordRepeat)

    const user = await User.findOne({ where: { email } })

    if (!user) return res.render("admin/session/reset-password", {
        user: req.body,
        token,
        error: "Usuário não cadastrado!"
    })

    // ver se a senha bate
    if (password != passwordRepeat) return res.render('admin/session/reset-password', {
        user: req.body,
        token,
        error: 'As senhas tem que ser iguais'
    })

    // verificar se o token bate
    if (token != user.reset_token) return res.render('admin/session/reset-password', {
        user: req.body,
        token,
        error: 'Token inválido! Solicite uma nova recuperação de senha'
    })

    // verificar se o token não expirou
    let now = new Date()
    now = now.setHours(now.getHours())

    if (now > user.reset_token_expires) return res.render('admin/session/reset-password', {
        user: req.body,
        token,
        error: 'Token expirado! Por favor, solicite uma nova recuperação de senha.'
    })

    req.user = user

    next()
}

module.exports = {
    login,
    forgot,
    reset,
}