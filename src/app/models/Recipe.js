const { create } = require("browser-sync");
const db = require("../../config/db");
const Base = require("./Base");

Base.init({ table: "recipes" });

module.exports = {
  ...Base,
  
  userRecipes(userId) {
    return db.query(
      `
            SELECT recipes.*,chefs.name AS chef_name 
            FROM recipes
            LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
            WHERE recipes.user_id = $1
            GROUP BY recipes.id, chefs.id
            ORDER BY recipes.updated_at`,
      [userId]
    );
  },

  async paginate(params) {
    const { filter, limit, offset } = params;

    let query = "",
      filterQuery = "",
      totalQuery = `(
                SELECT count(*) FROM recipes
            ) AS total`;

    if (filter) {
      filterQuery = `${query}
            WHERE recipes.title ILIKE '%${filter}%'
            `;

      totalQuery = `(
                SELECT count(*) FROM recipes
                ${filterQuery}
            ) as total`;
    }

    query = `
        SELECT recipes.*,${totalQuery}, chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        ${filterQuery}
        ORDER BY recipes.updated_at DESC
        LIMIT $1 OFFSET $2
        `;

    const results = await db.query(query, [limit, offset]);

    return results.rows;
  },

  async files(id) {
    const results = await db.query(
      `
        SELECT files.* FROM files 
        LEFT JOIN recipe_files ON (files.id = recipe_files.file_id) 
        WHERE recipe_files.recipe_id = $1
        `,
      [id]
    );

    return results.rows;
  },
};
