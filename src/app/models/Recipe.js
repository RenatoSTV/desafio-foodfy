const { date } = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
    all(callback){

        db.query(`SELECT recipes.*,  chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs
        ON (chefs.id = recipes.chef_id)`, function(err, results){
            if(err) throw `DATABASE error! ${err}`
            callback(results.rows)
        })

    },
    create(data){

        const query = `
            INSERT INTO recipes (
                chef_id,
                title,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES ( $1, $2, $3, $4, $5, $6)
            RETURNING id
        `

        const values = [
            data.chef,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso
        ]

        return db.query(query, values)

    },
    find(id, callback){
        db.query(`SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1`, [id], function(err, results){
            if(err) throw `DATABASE error! ${err}`

            callback(results.rows[0])
        })
    },
    findBy(filter, callback){
        db.query(`
            SELECT recipes.*, chefs.name AS chef_name 
            FROM recipes
            LEFT JOIN chefs ON (chef.id = recipes.chef_id)
            WHERE recipe.title ILIKE '%${filter}%'
            GROUP BY recipes.name, chef.id`, function(err, results){
                if(err) throw `DATABASE error! ${err}`

                callback(results.rows)
            })
    },
    
    put(data, callback){
        const query = `
            UPDATE recipes SET
                chef_id=($1),
                image_url=($2),
                title=($3),
                ingredients=($4),
                preparation=($5),
                information=($6)
            WHERE id = $7
        `

        const values = [
            data.chef,
            data.image_url,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        db.query(query, values, function(err, results){
            if(err) throw `DATABASE error! ${err}`

            callback(results.rows[0])
        })
    },
    delete(id, callback){
        db.query(`DELETE FROM recipes WHERE id = $1`, [id], function(err, results){
            if(err) throw `DATABASE error! ${err}`

            return callback()

        })
    },
    chefsSelectOptions(callback){
        db.query(`SELECT name, id FROM chefs`, function(err, results){
            if(err) throw `DATABASE error! ${err}`

            callback(results.rows)
        })
    },
    paginate(params) {
        const { filter, limit, offset, callback } = params

        let query = "",
            filterQuery = "",
            totalQuery = `(
                SELECT count(*) FROM recipes
            ) AS total`



        if (filter) {

            filterQuery = `${query}
            WHERE recipes.title ILIKE '%${filter}%'
            `

            totalQuery = `(
                SELECT count(*) FROM recipes
                ${filterQuery}
            ) as total`
        }

        query = `
        SELECT recipes.*,${totalQuery}, chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        ${filterQuery}
        LIMIT $1 OFFSET $2
        `

        db.query(query, [limit, offset], function (err, results) {
            if (err) throw `DATABASE error! ${err}`

            callback(results.rows)
        })
    }
}