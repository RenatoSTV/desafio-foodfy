const Chef = require("../models/Chef");
const File = require("../models/File");

const LoadRecipeService = require("../services/LoadRecipeServices");

module.exports = {
  //index
  async index(req, res) {
    try {
      const error = req.session.error;
      req.session.error = "";

      let results = await Chef.totalRecipes();

      const chefs = results.rows;

      async function getImage(chefId) {
        let files = await Chef.files(chefId);
        files = files.map((file) => `${file.path.replace("public", "")}`);

        return files[0];
      }

      const chefsPromise = chefs.map(async (chef) => {
        chef.img = await getImage(chef.id);
        return chef;
      });

      const allChefs = await Promise.all(chefsPromise);

      return res.render("admin/chefs/index", { chefs: allChefs, error });
    } catch (error) {
      console.log(error);
    }
  },

  //show
  async show(req, res) {
    try {
      const error = req.session.error;
      req.session.error = "";

      let id = req.params.id;
      let chef = await Chef.findOne({ where: { id } });
      let recipes = await LoadRecipeService.load("recipes", {
        where: { chef_id: chef.id },
      });

      const totalRecipes = recipes.length;

      let files = await File.showFiles(chef.file_id);
      files = files.map((file) => ({
        ...file,
        src: `${file.path.replace("public", "")}`,
      }));

      if (chef.id == null) {
        let totalRecipes = 0;

        let chef = await Chef.findOne({ where: { id } });

        if (!chef) return res.send("Chef not found!");

        return res.render("admin/chefs/show", {
          chef,
          files,
          totalRecipes,
          error,
        });
      } else {
        if (!chef) return res.send("Chef not found!");

        return res.render("admin/chefs/show", {
          chef,
          files,
          recipes,
          totalRecipes,
          error,
        });
      }
    } catch (error) {
      console.error(error);
    }
  },

  //create
  create(req, res) {
    return res.render("admin/chefs/create");
  },

  //post
  async post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Please, fill all fields");
      }
    }

    if (req.files.length == 0)
      return res.send("Please, send at least one image.");

    const filesPromise = req.files.map((file) =>
      File.create({
        name: file.filename,
        path: `/images/${file.filename}`,
      })
    );

    let fileId = await Promise.all(filesPromise);

    const fields = { name: req.body.name, file_id: fileId };

    let chefId = await Chef.create(fields);
    console.log(chefId);

    return res.redirect(`/admin/chefs/${chefId}`);
  },

  //edit
  async edit(req, res) {
    const id = req.params.id;
    let chef = await Chef.findOne({ where: { id } });
    let recipes = await LoadRecipeService.load("recipes", {
      where: { chef_id: chef.id },
    });

    const totalRecipes = recipes.length;

    let files = await File.showFiles(chef.file_id);
    files = files.map((file) => ({
      ...file,
      src: `${file.path.replace("public", "")}`,
    }));

    if (chef.id == null) {
      let totalRecipes = 0;

      let results = await Chef.findOne(req.params.id);
      const chef = results.rows[0];

      if (!chef) return res.send("Chef not found!");

      return res.render("admin/chefs/edit", {
        chef,
        totalRecipes,
        files,
      });
    } else {
      if (!chef) return res.send("Chef not found!");
      return res.render("admin/chefs/edit", {
        chef,
        totalRecipes,
        files,
      });
    }
  },

  //put
  async put(req, res) {
    try {
      const { id } = req.body;

      if (req.files.length != 0) {
        const newFilesPromise = req.files.map((file) =>
          File.create({
            name: file.filename,
            path: `/images/${file.filename}`,
          })
        );

        let fileId = await Promise.all(newFilesPromise);

        let values = {
          name: req.body.name,
          file_id: JSON.parse(fileId),
        };

        await Chef.update(id, values);

        await File.delete(req.body.file_id);

        return res.redirect(`/admin/chefs/${req.body.id}`);
      }

      let values = {
        name: req.body.name,
      };

      await Chef.update(id, values);

      return res.redirect(`/admin/chefs/${req.body.id}`);
    } catch (err) {
      console.error(err);
    }
  },

  //delete
  async delete(req, res) {
    console.log("aqui", req.body);
    await Chef.delete(req.body.id);

    return res.redirect("/admin/chefs");
  },
};
