const User = require('../models/User')

function onlyUsers(req, res, next) {
    if (!req.session.userId)
        return res.redirect("/admin/login")

    next()
}

function isLoggedRedirectToProfile(req, res, next) {
    if (req.session.userId)
        return res.redirect("/admin/index")

    next()
}

async function isAdmin(req, res, next) {

    if (!req.session.isAdmin) {
        req.session.error = "Apenas Administradores"
        
        return res.redirect(`${req.headers.referer}`)
        
    }

    next()
}

module.exports = {
    onlyUsers,
    isLoggedRedirectToProfile,
    isAdmin
}