const User = require('../models/User')
const crypto = require("crypto")
const mailer = require("../../lib/mailer")
const { hash } = require('bcryptjs')


module.exports = {
    async list(req, res) {
        try {
            const error = req.session.error
            req.session.error = ""
            const loggedId = req.session.userId

            let results = await User.all()
            let users = results.rows
            return res.render('admin/users/list', {users,error, loggedId})
        } catch (error) {
            console.error(error)
        }
    },
    registerForm(req, res) {
        return res.render('admin/users/register')
    },
    edit(req, res) {
        const { user } = req
        return res.render('admin/users/edit', { user, error })
    },
    async post(req, res) {

        try {
            const { name, email, is_admin } = req.body

        const password = crypto.randomBytes(8).toString("hex")

        await mailer.sendMail({
            to: email,
            from: 'no-reply@foodfy.com.br',
            subject: 'Cadastrado com sucesso!',
            html: `
            <h2>Bem vindo, ${name}</h2>
            <p>A partir de agora você pode criar, editar e visualizar suas receitas na plataforma Foodfy.</p>
            <p>Utilize os seguintes dados para login:</p>
            <p>E-mail: <strong>${email}</strong></p>
            <p>Senha: <strong>${password}</strong></p>
            <p>Para realizar seu login na plataforma, clique nesse link:<p/>
            <p>
                <a href="http://localhost:3000/admin/login" tarket="_blank" style="text-decoration: none; color: red;">
                    Acesse sua conta!
                </a>
            </p>
            `
        })
        const passwordHash = await hash(password, 8);

        const fields = {
            name,
            email,
            password: passwordHash,
            is_admin
        }

        const userId = await User.create(fields)

        return res.redirect('/admin/users')
        } catch (error) {
            console.error(error)
        }
    },
    async update(req, res) {
        try {
            let { name, email, is_admin, id } = req.body

            if (is_admin === undefined) {
                is_admin = "false"
            } else {
                is_admin = "true"
            }

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
    async delete(req, res) {
        try {
            console.log(req.body)
            await User.delete(req.body.id)

            return res.render("admin/admin_index", {
                success: "Conta deletada com sucesso!"
            })

        } catch (error) {
            console.error(error)
            return res.render("admin/users/index", {
                user: req.body,
                error: "Erro ao tentar deletar conta!"
            })
        }

        //return res.redirect('/admin/users')
    },
}