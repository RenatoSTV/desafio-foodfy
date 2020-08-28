const data = require('../../data.json')
const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
    async index(req, res) {
        try {
            const { filter } = req.query

            if (filter) {

                let recipes = await Recipe.findBy(filter)

                return res.render("website/recipes", { recipes })
            } else {
                let results = await Recipe.all()
                const recipes = results.rows

                if (!recipes) return res.send("Recipes not found")

                async function getImage(recipeId) {
                    let results = await Recipe.files(recipeId)
                    const files = results.rows.map(file =>
                        `${req.protocol}://${req.headers.host}${file.path.replace("public\\images\\", "\\\\images\\\\")}`
                    )

                    return files[0]
                }

                const recipesPromise = recipes.map(async recipe => {
                    recipe.img = await getImage(recipe.id)
                    return recipe
                }).filter((product, index) => index > 5 ? false : true)

                const lastAdded = await Promise.all(recipesPromise)

                return res.render("website/index", { recipes: lastAdded })

            }
        } catch (error) {
            console.log(error)
        }


    },
    about(req, res) {
        return res.render("website/about")
    },

    async recipes(req, res) {
        // Recipe.(function (recipes) {

        //     return res.render("website/recipes", { recipes })
        // })

        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 3
        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset
        }

        let results = await Recipe.paginate(params)

        const recipes = results.rows

        let mathTotal =
            recipes[0] == undefined
                ? 0
                : Math.ceil(recipes[0].total / limit)

        const pagination = {
            total: mathTotal,
            page
        }


        if (!recipes) return res.send("Recipes not found")

        async function getImage(recipeId) {
            let results = await Recipe.files(recipeId)
            const files = results.rows.map(file =>
                `${req.protocol}://${req.headers.host}${file.path.replace("public\\images\\", "\\\\images\\\\")}`
            )

            return files[0]
        }

        const recipesPromise = recipes.map(async recipe => {
            recipe.img = await getImage(recipe.id)
            return recipe
        })

        const lastAdded = await Promise.all(recipesPromise)

        return res.render("website/recipes", { recipes: lastAdded, pagination, filter })

    },

    async chefs(req, res) {
        let results = await Chef.totalRecipes()

        const chefs = results.rows
        const chefId = results.rows[0].id

        async function getImage(chefId) {
            let results = await Chef.files(chefId)
            const files = results.rows.map(file =>
                `${req.protocol}://${req.headers.host}${file.path.replace("public\\images\\", "\\\\images\\\\")}`
            )

            return files[0]
        }

        const chefsPromise = chefs.map(async chef => {
            chef.img = await getImage(chef.id)
            return chef
        })

        const allChefs = await Promise.all(chefsPromise)

        return res.render("website/chefs", { chefs: allChefs })


    },

    async recipe(req, res) {
        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        if (!recipe) return res.send("Recipe not found!")

        results = await Recipe.files(recipe.id)

        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("website/recipe", { recipe, files })
        

    },
    async search (req, res) {
        try {

            let results,
                params = {}

            const { filter } = req.query

            if (!filter) return res.redirect("/")

            params.filter = filter

            results = await Recipe.findBy(filter)

            async function getImage(recipeId) {
                let results = await Recipe.files(recipeId)
                const files = results.rows.map(file => 
                    `${req.protocol}://${req.headers.host}${file.path.replace("public\\images\\", "\\\\images\\\\")}`
                )
    
                return files[0]
            }

            const recipesPromise = results.rows.map(async recipe => {
                recipe.img = await getImage(recipe.id)
                return recipe
            })

            const recipes = await Promise.all(recipesPromise)

            const search = {
                term: req.query.filter,
                total: recipes.length
            }

            return res.render("website/recipes", { recipes, search, categories })

        } catch (error) {
            console.log(error)
        }
    }
}
