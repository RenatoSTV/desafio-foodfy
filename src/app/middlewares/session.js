const User = require('../models/User')

function onlyUsers(req, res, next) {
    if (!req.session.userId)
        return res.redirect("/admin/login")

    next()
}

function isLoggedRedirectToProfile(req, res, next) {
    if (req.session.userId)
        return res.redirect("/admin/profile")

    next()
}

async function isAdmin(req, res, next) {
    req.session.error = ""

    if (!req.session.isAdmin) {
        req.session.error = "Apenas Administradores"
        
        return res.redirect(`${req.headers.referer}`)
        
    }

    next()
}

module.exports = {
    onlyUsers,
    isLoggedRedirectToProfile,
    isAdmin,
}