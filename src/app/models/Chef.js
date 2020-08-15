const { date } = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
    all() {

        return db.query(`
            SELECT * FROM chefs
            ORDER BY chefs.name
        `)

    },
    create(data, fileId) {

        const query = `
            INSERT INTO chefs (
                name,
                file_id,
                created_at
            ) VALUES ( $1, $2, $3)
            RETURNING id
        `

        const values = [
            data.name,
            fileId,
            date(Date.now()).iso
        ]

        return db.query(query, values)

    },
    find(id) {
        let query = `SELECT * 
        FROM chefs
        WHERE id = $1`

        return db.query(query, [id])
    },
    put(data, fileId) {
        const query = `
            UPDATE chefs SET
                name=($1),
                file_id=($2)
            WHERE id = $3
        `

        const values = [
            data.name,
            fileId,
            data.id
        ]

        return db.query(query, values)
    },
    delete(id) {
        return db.query('DELETE FROM chefs WHERE id = $1', [id])
    },
    chefShow(id) {


        // let query = `
        // SELECT *, recipes.id As chef_id
        // FROM recipes
        // INNER JOIN chefs
        // ON (chefs.id = recipes.chef_id)

        // WHERE chefs.id = $1

        // `

        let query = `
        SELECT chefs.*, recipes.*
        FROM chefs
        LEFT JOIN recipes
        ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        `

        return db.query(query, [id])
    },
    totalRecipes() {
        return db.query(`
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            GROUP BY chefs.id
            ORDER BY total_recipes DESC`)
    },
    files(id) {
        return db.query(`
            SELECT * FROM files 
            LEFT JOIN chefs
            ON (files.id = chefs.file_id)
            WHERE chefs.id = $1
        `, [id])
    }
    
}