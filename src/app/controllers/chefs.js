const Chef = require('../models/Chef')

module.exports = {
    //index
    index(req, res) {

        Chef.all(function (chefs) {
            return res.render("admin/chefs/index", { chefs })
        })

    },

    //show
    show(req, res) {
        Chef.find(req.params.id, function (chef) {
            if (!chef) return res.send("Chef not found!")


            return res.render("admin/chefs/show", { chef })
        })



    },

    //create
    create(req, res) {

        return res.render("admin/chefs/create")
    },

    //post
    post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Please, fill all fields")
            }
        }

        Chef.create(req.body, function (chef) {
            return res.redirect(`admin/chefs/${chef.id}`)
        })
    },

    //edit
    edit(req, res) {

        const { id } = req.params

        const foundRecipe = data.recipes.find(function (recipe) {
            return recipe.id == id
        })

        if (!foundRecipe) return res.send("Recipe not found!")

        const recipe = {
            ...foundRecipe,
        }

        return res.render("admin/chefs/edit", { recipe })
    },

    //put
    put(req, res) {

        const { id } = req.body
        let index = 0

        const foundRecipe = data.recipes.find(function (recipe, foundIndex) {
            if (id == recipe.id) {
                index = foundIndex
                return true
            }
        })

        if (!foundRecipe) return res.send("Recipe not found!")

        const recipe = {
            ...foundRecipe,
            ...req.body,
            id: Number(req.body.id)
        }

        data.recipes[index] = recipe

        fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
            if (err) return res.send("Write error!")

            return res.redirect(`/admin/recipes/${id}`)
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