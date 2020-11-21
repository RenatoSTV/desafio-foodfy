const db = require('../../config/db')
const fs = require('fs')
const Base = require("./Base");

Base.init({ table: "files" });


module.exports = {
    ...Base,
    async createRecipeFiles({ name, path, recipe_id }) {
        let query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ($1, $2)
            RETURNING id
        `;

        let values = [
            name,
            path
        ];

        const results = await db.query(query, values);
        const fileId = results.rows[0].id;

        query = `
            INSERT INTO recipe_files (
                recipe_id,
                file_id
            ) VALUES ($1, $2)
            RETURNING id
        `;

        values = [
            recipe_id,
            fileId
        ];

        const results2 = await db.query(query, values)
        return results2.rows[0].id
    },
    async createChefFile ({ name, path }) {
        let query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ($1, $2)
            RETURNING id
        `;

        let values = [
            name,
            path
        ];

        const results = await db.query(query, values)
        return results.rows[0].id
    },
    async showFiles(fileId){
        const results = await db.query(`
        SELECT files.* FROM files WHERE id = $1`, [fileId])
        return results.rows
    },
    async deleteFromRecipeFiles(id){
        try{
            const result = await db.query(`SELECT * FROM recipe_files WHERE file_id = $1`, [id])
            const file = result.rows[0]

            fs.unlinkSync(file.path)

        }catch(err){
            console.error(err)
        }

        return db.query(`
        DELETE FROM recipe_files WHERE file_id = $1`, [id])
    },
    deleteFromFiles(id){
        return db.query(`
        DELETE FROM files WHERE id = $1`, [id])
    }
}