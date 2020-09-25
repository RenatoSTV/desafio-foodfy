const { date } = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
    all(){

        return db.query(`SELECT recipes.*,  chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs
        ON (chefs.id = recipes.chef_id)
        ORDER BY recipes.created_at DESC`)

    },
    create(data, userId){

        const query = `
            INSERT INTO recipes (
                chef_id,
                title,
                ingredients,
                preparation,
                information,
                user_id
            ) VALUES ( $1, $2, $3, $4, $5, $6)
            RETURNING id
        `

        const values = [
            data.chef,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            userId
        ]

        return db.query(query, values)

    },
    find(id){
        return db.query(`SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1`, [id])
    },
    findBy(filter){
        return db.query(`
            SELECT recipes.*,chefs.name AS chef_name 
            FROM recipes
            LEFT JOIN chefs ON (chef.id = recipes.chef_id)
            WHERE recipes.title ILIKE '%${filter}%'
            GROUP BY recipes.name, chef.id
            ORDER BY recipes.updated_at`)
    },
    
    put(data){
        const query = `
            UPDATE recipes SET
                chef_id=($1),
                title=($2),
                ingredients=($3),
                preparation=($4),
                information=($5)
            WHERE id = $6
        `

        const values = [
            data.chef,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        return db.query(query, values)
    },
    delete(id){
        db.query(`DELETE FROM recipes WHERE id = $1`, [id])
    },
    chefsSelectOptions(callback){
        db.query(`SELECT name, id FROM chefs`, function(err, results){
            if(err) throw `DATABASE error! ${err}`

            callback(results.rows)
        })
    },
    paginate(params) {
        const { filter, limit, offset } = params

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
        ORDER BY recipes.updated_at DESC
        LIMIT $1 OFFSET $2
        `

        return db.query(query, [limit, offset])
    },
    files(id) {
        return db.query(`
        SELECT files.* FROM files LEFT JOIN recipe_files ON (files.id = recipe_files.file_id) LEFT
        JOIN recipes ON (recipes.id = recipe_files.recipe_id) WHERE recipes.id = $1
        `, [id]);
    }
}