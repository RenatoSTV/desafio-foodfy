const User = require('../models/User')

module.exports = {
    async list(req, res) {
        let results = await User.all()
        let users = results.rows
        return res.render('admin/users/list', {users})
    },
    registerForm(req,res) {
        return res.render('admin/users/register')
    },
    edit(req, res){
        const {user} = req
        return res.render('admin/users/edit', {user})
    },
    async post(req, res) {

        const userId = await User.create(req.body)

        return res.redirect('/admin/users')
    },
    async update(req, res) {
        try {
            let {name, email, is_admin, id} = req.body
            
            if (is_admin === undefined) {
                is_admin = "false"
            } else {
                is_admin = "true"
            }
            console.log(is_admin)

            await User.update(id, {
                name,
                email,
                is_admin
            })

            let results = await User.all()
            let users = results.rows

            return res.render("admin/users/list", {
                users,
                success: "Usuário atualizado com sucesso!"
            })

        } catch (error) {
            console.error(error)

            let results = await User.all()
            let users = results.rows

            return res.render("admin/users/list", {
                users,
                error: "Algum erro aconteceu!"
            })
        }
    },
    async delete(req, res){
        try {
            console.log(req.body.id)
            // await User.delete(req.body.id)
            // req.session.destroy()

            return res.render("admin/users/list", {
                success: "Conta deletada com sucesso!"
            })
            
        } catch (error) {
            console.error(error)
            return res.render("admin/users/index", {
                user: req.body,
                error: "Erro ao tentar deletar conta!"
            })
        }
    },
}