const data = require('../../data.json')

module.exports = {
    index(req, res) {
        return res.render("website/index", { recipes: data.recipes })
    },
    about(req, res) {
        return res.render("website/about")
    },

    recipes(req, res) {
        return res.render("website/recipes", { recipes: data.recipes })
    },

    recipe(req, res) {
        const recipeIndex = req.params.index
        const recipe = data.recipes[recipeIndex]

        return res.render("website/recipe", { recipe })
    }
}
