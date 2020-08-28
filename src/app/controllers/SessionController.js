module.exports = {
    loginForm(req, res) {
        return res.render('admin/session/login')
    },
    login(req, res) {
        // colocar o usuário no req.session
        req.session.userId = req.user.id

        return res.redirect("/admin/profile")

    },
    logout(req, res) {
        req.session.destroy()
        return res.redirect("/")
    },
    forgotForm(req, res) {
        return res.render('admin/session/forgot-password')
    },
    resetForm(req, res) {
        return res.render('admin/session/reset-password')
    },
    register(req,res) {
        return res.render('admin/users/register')
    }
}