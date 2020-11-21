const User = require("../models/User");

module.exports = {
  index(req, res) {
    const { user } = req;
    const error = req.session.error;
    req.session.error = "";

    let success = `Bem vindo(a), ${user.name}!`
    if( error ) {success = ""}

    return res.render("admin/users/index", {
      user,
      success,
      error,
    });
  },
  async put(req, res) {
    try {
      let { name, email, id } = req.body;

      await User.update(id, {
        name,
        email,
      });

      const user = await User.findOne(id);

      return res.render("admin/users/index", {
        user,
        success: "Perfil atualizado com sucesso!",
      });
    } catch (error) {
      console.error(error);

      let results = await User.findAll();
      let users = results.rows;

      return res.render("admin/users/list", {
        users,
        error: "Algum erro aconteceu!",
      });
    }
  },
};
