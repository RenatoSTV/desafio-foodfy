const Recipe = require('../models/Recipe')

module.exports = {
    //index
    index(req,res){
        Recipe.all(function (recipes) {
            
            return res.render("admin/recipes/index", { recipes })
        })

    },

    //show
    show(req, res) {
        Recipe.find(req.params.id, function(recipe){
            if(!recipe) return res.send("Student not found!")

            return res.render("admin/recipes/show", { recipe })
        })

    },

    //create
    create(req, res) {

        Recipe.chefsSelectOptions(function(options){
            return res.render("admin/recipes/create", {chefOptions: options})

        })
        
    },

    //post
    post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Please, fill all fields")
            }
        }

        Recipe.create(req.body, function(recipe){
            return res.redirect(`/admin/recipes/${recipe.id}`)
        })
    },

    //edit
    edit(req, res) {

        Recipe.find(req.params.id, function(recipe){
            if(!recipe) return res.send("Recipe not found!")

            Recipe.chefsSelectOptions(function(options){
    
                return res.render("admin/recipes/edit", { recipe, chefOptions: options})
            })
        })
    },

    //put
    put(req, res) {

        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                console.log(req.body)
                return res.send("Please, fill all fields")
            }
        }

        Recipe.put(req.body, function(){
            return res.redirect(`/admin/recipes/${req.body.id}`)
        })
    },

    //delete
    delete(req, res) {
        const { id } = req.body

        const filteredRecipes = data.recipes.filter(function (recipe) {
            return recipe.id != id
        })

        data.recipes = filteredRecipes

        fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
            if (err) return res.send("Write error!")
            return res.redirect("/admin/recipes")
        })
    }
}

