const User = require('../models/User')

function onlyUsers(req, res, next) {
    if(!req.session.userId)
        return res.redirect("/admin/login")
    
    next()
}

function isLoggedRedirectToAdmin(req, res, next) {
    if(req.session.userId)
        return res.redirect("/admin/index")

    next()
}

async function isAdmin(req, res, next) {
    const { userId: id } = req.session

    const user = await User.findOne({ where: { id } })
    if(user.is_admin == false) return res.render("admin/admin_index", {
        error: "Apenas Administradores!"
    })

    next()
}

module.exports = {
    onlyUsers,
    isLoggedRedirectToAdmin,
    isAdmin
}