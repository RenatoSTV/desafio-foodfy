const data = require('../../data.json')
const Recipe = require('../models/Recipe')

module.exports = {
    index(req, res) {
        return res.render("website/index", { recipes: data.recipes })
    },
    about(req, res) {
        return res.render("website/about")
    },

    recipes(req, res) {
        Recipe.all(function (recipes) {
            
            return res.render("website/recipes", { recipes })
        })
        
    },

    recipe(req, res) {
        Recipe.find(req.params.id, function(recipe){
            if(!recipe) return res.send("Recipe not found!")

            return res.render("website/recipe", { recipe })
        })

    }
}
