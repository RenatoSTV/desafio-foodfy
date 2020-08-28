module.exports = {
    index(req, res) {
        const {user} = req

        return res.render('admin/users/index', {user})
    },
    put(req,res) {
        return res.render('admin/profile/register')
    }
}