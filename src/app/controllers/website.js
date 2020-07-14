const data = require('../../data.json')
const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
    index(req, res) {

        const { filter } = req.query

        if (filter) {
            Recipe.findBy(filter, function (recipes) {
                return res.render("website/recipes", { recipes })
            })
        } else {
            Recipe.all(function (recipes) {

                let mostAcesseds = []
                for (let recipe of recipes) {
                    if (mostAcesseds.length < 6) {
                        mostAcesseds.push(recipe)
                    }
                }
                console.log(mostAcesseds)
                return res.render("website/index", { recipes: mostAcesseds })
            })
        }

    },
    about(req, res) {
        return res.render("website/about")
    },

    recipes(req, res) {
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
            offset,
            callback(recipes) {
                let mathTotal =
                    recipes[0] == undefined
                        ? 0
                        : Math.ceil(recipes[0].total / limit)

                const pagination = {
                    total: mathTotal,
                    page
                }
                console.log(recipes)
                return res.render("website/recipes", { recipes, pagination, filter })
            }
        }

        Recipe.paginate(params)

    },

    chefs(req, res) {
        Chef.totalRecipes(function (chefs) {

            return res.render("website/chefs", { chefs })
        })

    },

    recipe(req, res) {
        Recipe.find(req.params.id, function (recipe) {
            if (!recipe) return res.send("Recipe not found!")
            console.log(recipe)
            return res.render("website/recipe", { recipe })
        })

    }
}
