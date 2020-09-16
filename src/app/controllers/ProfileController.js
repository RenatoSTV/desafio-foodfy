module.exports = {
    index(req, res) {
        const {user} = req

        return res.render('admin/users/index', {user, 
            success: `Bem vindo(a), ${user.name}!`})
    },
    put(req,res) {
        console.log(req.body)
        return res.render('admin/admin_index')
    }
}