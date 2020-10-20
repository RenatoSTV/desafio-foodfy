const User = require("../models/User");

module.exports = {
  index(req, res) {
    const { user } = req;

    return res.render("admin/users/index", {
      user,
      success: `Bem vindo(a), ${user.name}!`,
    });
  },
  async put(req, res) {
    try {
      let { name, email, id } = req.body;

      await User.update(id, {
        name,
        email,
      });

      const user = await User.findOne({ where: { id } });

      return res.render("admin/users/index", {
        user,
        success: "Perfil atualizado com sucesso!",
      });
    } catch (error) {
      console.error(error);

      let results = await User.all();
      let users = results.rows;

      return res.render("admin/users/list", {
        users,
        error: "Algum erro aconteceu!",
      });
    }
    return res.render("admin/admin_index");
  },
};
