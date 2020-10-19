const User = require("../models/User");
const crypto = require("crypto");
const mailer = require("../../lib/mailer");
const { hash } = require("bcryptjs");

module.exports = {
    loginForm(req, res) {
        return res.render('admin/session/login')
    },
    login(req, res) {
        // colocar o usuário no req.session
        req.session.userId = req.user.id
        req.session.isAdmin = req.user.is_admin

        return res.redirect("/admin/profile")

    },
    logout(req, res) {
        req.session.destroy()
        return res.redirect("/")
    },
    forgotForm(req, res) {
        return res.render('admin/session/forgot-password')
    },
    async forgot(req, res) {
        const user = req.user

        try {
            // criar um token para esse usuário
            const token = crypto.randomBytes(20).toString("hex")

            // criar uma expiração do token
            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            // enviar um email com um link de recuperação de senha
            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@launchstore.com.br',
                subject: 'Recuperação de senha',
                html: `<h2>Esqueceu a senha?</h2>
            <p>Não se preocupe, clique no link abaixo para recuperar a sua senha</p>
            <p>
                <a href="http://localhost:3000/admin/password-reset?token=${token}" tarket="_blank">
                    RECUPERAR SENHA
                </a>
            </p>
            `,
            })

            // avisar o usuário que enviamos o email
            return res.render("admin/session/forgot-password", {
                success: "Verifique seu email para resetar a sua senha!"
            })
        } catch (error) {
            console.error(error)
            return res.render("admin/session/forgot-password", {
                error: "Erro inesperado. Tente novamente!"
            })
        }

    },
    resetForm(req, res) {
        return res.render('admin/session/reset-password', {token: req.query.token})
    },
    async reset(req, res) {
        const user = req.user
        const { password, token } = req.body

        try {
            //cria um novo hash de senha
            const newPassword = await hash(password, 8)
            
            // atualiza o usuário
            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: "",
            })

            // avisa o usuário que ele tem uma nova senha
            return res.render("admin/session/login", {
                user: req.body,
                success: "Senha atualizada! Faça o seu login."
            })
            
        } catch (error) {
            console.error(error)
            return res.render("admin/session/reset-password", {
                user: req.body,
                token,
                error: "Erro inesperado. Tente novamente!"
            })
        }
    },
    register(req,res) {
        return res.render('admin/users/register')
    }
}