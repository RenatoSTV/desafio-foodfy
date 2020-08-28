const Recipe = require('../models/Recipe')
const File = require('../models/File')
const Chef = require('../models/Chef')

module.exports = {
    //index
    async index(req, res) {
        try {
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
            })

            const lastAdded = await Promise.all(recipesPromise)

            return res.render("admin/recipes/index", { recipes: lastAdded })
        } catch (error) {
            console.log(error)
        }

    },

    //show
    async show(req, res) {

        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        if (!recipe) return res.send("Recipe not found!")

        results = await Recipe.files(recipe.id)

        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("admin/recipes/show", { recipe, files })

        // Recipe.find(req.params.id, function (recipe) {
        //     if (!recipe) return res.send("Student not found!")

        //     return res.render("admin/recipes/show", { recipe })
        // })

    },

    //create
    create(req, res) {

        Chef.all()
            .then(function (results) {

                const chefs = results.rows

                return res.render("admin/recipes/create", { chefs })

            }).catch(function (err) {

                throw new Error(err)

            })

        // Recipe.chefsSelectOptions(function (options) {
        //     return res.render("admin/recipes/create", { chefOptions: options })

        // })

    },

    //post
    async post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Please, fill all fields")
            }
        }

        if (req.files.length == 0)
            return res.send('Please, send at least one image.')


        let results = await Recipe.create(req.body)
        const RecipeId = results.rows[0].id

        const filesPromise = req.files.map(file => File.createRecipeFiles({ ...file, recipe_id: RecipeId }))
        await Promise.all(filesPromise)

        return res.redirect(`/admin/recipes/`)

        // Recipe.create(req.body, function(recipe){
        //     return res.redirect(`/admin/recipes/${recipe.id}`)
        // })
    },

    //edit
    async edit(req, res) {

        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        if (!recipe) return res.send("Recipe not found!")

        results = await Chef.all()
        const chefs = results.rows

        results = await Recipe.files(recipe.id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("admin/recipes/edit", { recipe, chefs, files })

        // Recipe.find(req.params.id, function (recipe) {
        //     if (!recipe) return res.send("Recipe not found!")

        //     Recipe.chefsSelectOptions(function (options) {

        //         return res.render("admin/recipes/edit", { recipe, chefOptions: options })
        //     })
        // })
    },

    //put
    async put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files") {
                return res.send('Please, fill all fields!')
            }
        }

        if (req.files.length != 0) {
            const newFilesPromise = req.files.map(file => File.createRecipeFiles({ ...file, recipe_id: req.body.id }))
            await Promise.all(newFilesPromise)
        }


        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",")
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1)

            const removedFilesPromise = removedFiles.map(id => File.deleteFromRecipeFiles(id))

            await Promise.all(removedFilesPromise)
        }

        await Recipe.put(req.body)
        

        return res.redirect(`/admin/recipes/`)
    },
    
    //delete
    async delete(req, res) {
        await Recipe.delete(req.body.id)

        return res.redirect("/admin/recipes")
    }
}

