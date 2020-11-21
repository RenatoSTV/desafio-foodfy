const db = require("../../config/db");
const Recipe = require("../models/Recipe");
const fs = require("fs");
const Base = require("./Base");

Base.init({ table: "users" });

module.exports = {
    ...Base,
//   async findOne(id) {
//     let query = `SELECT users.* 
//         FROM users
//         WHERE id = $1`;

//     const results = await db.query(query, [id]);
//     return results.rows[0];
//   },

//   async findAll() {
//     return db.query("SELECT * FROM users");
//   },
//   async create(fields) {
//     try {
//       const query = `
//             INSERT INTO users (
//                 name,
//                 email,
//                 is_admin,
//                 password
//             ) VALUES ($1, $2, $3, $4)
//             RETURNING id
//         `;
//       let { name, email, is_admin, password } = fields;

//       if (is_admin === undefined) {
//         is_admin = "false";
//       } else {
//         is_admin = "true";
//       }

//       const values = [name, email, is_admin, password];

//       const results = await db.query(query, values);

//       return results.rows[0].id;
//     } catch (err) {
//       console.error(err);
//     }
//   },
//   async update(id, fields) {
//     let query = "UPDATE users SET";

//     Object.keys(fields).map((key, index, array) => {
//       if (index + 1 < array.length) {
//         query = `${query}
//                 ${key} = '${fields[key]}',
//                 `;
//       } else {
//         // last iteration
//         query = `${query}
//                 ${key} = '${fields[key]}'
//                 WHERE id = ${id}
//                 `;
//       }
//     });

//     await db.query(query);
//     return;
//   },
  async delete(id) {
    // pegar todos as receitas
    let results = await db.query("SELECT * FROM recipes WHERE user_id = $1", [
      id,
    ]);
    const recipes = results.rows;

    //das receitas, pegar todas as imagens
    const allFilesPromise = recipes.map((recipe) => Recipe.files(recipe.id));

    let promiseResults = await Promise.all(allFilesPromise);

    // rodar a remoção do usuário
    await db.query("DELETE FROM users WHERE id = $1", [id]);

    // remover as imagens da pasta public
    promiseResults.map((results) => {
      results.map((file) => {
        console.log(file)
        try {
          fs.unlinkSync(file.path);
        } catch (error) {
          console.error(error);
        }
      });
    });
  },
};
