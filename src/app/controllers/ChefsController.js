const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')
const File = require('../models/File')

module.exports = {
    //index
    async index(req, res) {

        // let results = await Chef.all()
        // const chefs = results.rows
        // return res.render("admin/chefs/index", { chefs })

        try {
            let results = await Chef.all()
            const chefs = results.rows

            if (!chefs) return res.send("Chefs not found")

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

            return res.render("admin/chefs/index", { chefs: allChefs })
        } catch (error) {
            console.log(error)
        }

    },

    //show
    async show(req, res) {
        let chefId = req.params.id
        let results = await Chef.chefShow(chefId)
        const chef = results.rows[0]
        const recipes = results.rows
        const totalRecipes = results.rowCount

        let resultsFiles = await File.showFiles(chef.file_id)
        const files = resultsFiles.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

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

        const allRecipes = await Promise.all(recipesPromise)

        if (chef.id == null) {

            let totalRecipes = 0

            let results = await Chef.find(req.params.id)
            const chef = results.rows[0]
            const chefId = req.params.id
            

            if (!chef) return res.send("Chef not found!")

            return res.render("admin/chefs/show", { chef, totalRecipes, chefId, files })

        } else {
            if (!chef) return res.send("Chef not found!")

            return res.render("admin/chefs/show", { chef, recipes: allRecipes, chefId, totalRecipes, files })
        }

    },

    //create
    create(req, res) {

        return res.render("admin/chefs/create")
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


        const filesPromise = req.files.map(file => File.create({ ...file }))
        const resultsFile = await filesPromise[0]
        const fileId = resultsFile.rows[0].id

        let results = await Chef.create(req.body, fileId)
        const chef = results.rows[0]

        return res.redirect(`/admin/chefs/${chef.id}`)

    },

    //edit
    async edit(req, res) {
        const chefId = req.params.id
        let results = await Chef.chefShow(chefId)
        const chef = results.rows[0]
        const recipes = results.rows
        const totalRecipes = results.rowCount

        let resultsFiles = await File.showFiles(chef.file_id)
        const files = resultsFiles.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        if (chef.id == null) {

            let totalRecipes = 0

            let results = await Chef.find(req.params.id)
            const chef = results.rows[0]
            const chefId = results.rows[0].id

            if (!chef) return res.send("Chef not found!")

            return res.render("admin/chefs/edit", { chef, totalRecipes, chefId, files })

        } else {
            if (!chef) return res.send("Chef not found!")

            return res.render("admin/chefs/edit", { chef, recipes, totalRecipes, chefId, files })
        }


        // Chef.chefShow(req.params.id, function (chef, recipes, totalRecipes, chefId) {

        //     if (chef.id == null) {

        //         totalRecipes = 0
        //         Chef.find(req.params.id, function (chef) {

        //             if (!chef) return res.send("Chef not found!")

        //             return res.render("admin/chefs/edit", { chef, totalRecipes, chefId })
        //         })
        //     } else {
        //         if (!chef) return res.send("Chef not found!")

        //         return res.render("admin/chefs/edit", { chef, recipes, totalRecipes, chefId })
        //     }

        // })
    },

    //put
    async put(req, res) {

        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Please, fill all fields")
            }
        }

        if (req.files.length != 0) {
            const newFilesPromise = req.files.map(async file =>
                File.createChefFile({ ...file }))

            await Promise.all(newFilesPromise)
            const resultsFile = await newFilesPromise[0]
            const fileId = resultsFile.rows[0].id
    
            await Chef.put(req.body, fileId)
        }


        return res.redirect(`/admin/chefs/${req.body.id}`)
        
    },

    //delete
    async delete(req, res) {
        await Chef.delete(req.body.id)

        return res.redirect('/admin/chefs')
    }
}