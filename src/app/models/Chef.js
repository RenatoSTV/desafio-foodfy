const { date } = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
    all() {

        return db.query(`
            SELECT *FROM chefs
        `)

    },
    create(data, callback) {

        const query = `
            INSERT INTO chefs (
                name,
                avatar_url,
                created_at
            ) VALUES ( $1, $2, $3)
            RETURNING id
        `

        const values = [
            data.name,
            data.avatar_url,
            date(Date.now()).iso
        ]

        db.query(query, values, function (err, results) {
            if (err) throw `DATABASE error! ${err}`

            callback(results.rows[0])
        })

    },
    find(id, callback) {
        db.query(`SELECT * 
        FROM chefs
        WHERE id = $1`, [id], function (err, results) {
            if (err) throw `DATABASE error! ${err}`

            callback(results.rows[0])
        })
    },
    put(data, callback) {
        const query = `
            UPDATE chefs SET
                name=($1),
                avatar_url=($2)
            WHERE id = $3
        `

        const values = [
            data.name,
            data.avatar_url,
            data.id
        ]

        db.query(query, values, function (err, results) {
            if (err) throw `DATABASE error! ${err}`

            callback()
        })
    },
    delete(id, callback) {
        db.query(`DELETE FROM chefs WHERE id = $1`, [id], function (err, results) {
            if (err) throw `DATABASE error! ${err}`

            return callback()

        })
    },
    chefShow(id, callback) {


        // let query = `
        // SELECT *, recipes.id As chef_id
        // FROM recipes
        // INNER JOIN chefs
        // ON (chefs.id = recipes.chef_id)

        // WHERE chefs.id = $1

        // `

        let query = `
        SELECT *
        FROM chefs
        LEFT JOIN recipes
        ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        `

        db.query(query, [id], function (err, results) {
            if (err) throw `DATABASE error! ${err}`

            callback(results.rows[0], results.rows, results.rowCount, id)
        })
    },
    totalRecipes(callback) {
        db.query(`
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            GROUP BY chefs.id
            ORDER BY total_recipes DESC`, function (err, results) {
            if (err) throw `DATABASE error! ${err}`

            callback(results.rows)
        })
    }
    
}