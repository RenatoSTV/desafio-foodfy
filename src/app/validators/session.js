const User = require('../models/User')
const { compare } = require('bcryptjs')

async function login(req, res, next) {

    // veriicar se o usuário está cadastrado
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })
    
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

module.exports = {
    login,
}