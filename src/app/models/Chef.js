const db = require("../../config/db");
const Base = require("./Base");

Base.init({ table: "chefs" });

module.exports = {
  ...Base,
  async chefShow(id) {
    let query = `
      SELECT chefs.*, recipes.*
      FROM chefs
      LEFT JOIN recipes
      ON (chefs.id = recipes.chef_id)
      WHERE chefs.id = $1`;

    return db.query(query, [id]);
  },
  totalRecipes() {
    return db.query(`
      SELECT chefs.*, count(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      GROUP BY chefs.id
      ORDER BY total_recipes DESC`);
  },
  async files(id) {
    const results = await db.query(
      `
      SELECT files.* FROM files
      LEFT JOIN chefs ON(files.id = chefs.file_id)
      WHERE chefs.id = $1
      `,
      [id]
    );
    return results.rows;
  },
};
