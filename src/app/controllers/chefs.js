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
        Chef.chefShow(req.params.id, function (chef, recipes, totalRecipes, chefId) {
            console.log(chefId)
            if(chef.id == null){

                totalRecipes = 0
                Chef.find(req.params.id, function (chef) {
                    if (!chef) return res.send("Chef not found!")
        
                    return res.render("admin/chefs/show", { chef, totalRecipes, chefId })
                })
            } else{
                if (!chef) return res.send("Chef not found!")

            return res.render("admin/chefs/show", { chef, recipes, totalRecipes, chefId  })
            }
            
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
            return res.redirect(`/admin/chefs/${chef.id}`)
        })
    },

    //edit
    edit(req, res) {

        // Chef.find(req.params.id, function (chef) {
        //     if (!chef) return res.send("Chef not found!")
        //     console.log(chef)
        //     return res.render("admin/chefs/edit", { chef })
        // })

        Chef.chefShow(req.params.id, function (chef, recipes, totalRecipes, chefId) {
            console.log(chef)
            if(chef.id == null){

                totalRecipes = 0
                Chef.find(req.params.id, function (chef) {
                    console.log(chef)
                    if (!chef) return res.send("Chef not found!")
                    
                    return res.render("admin/chefs/edit", { chef, totalRecipes, chefId })
                })
            } else{
                if (!chef) return res.send("Chef not found!")
                
            return res.render("admin/chefs/edit", { chef, recipes, totalRecipes, chefId  })
            }
            
        })
        

    },

    //put
    put(req, res) {

        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Please, fill all fields")
            }
        }

        Chef.put(req.body, function(){
            return res.redirect(`/admin/chefs/${req.body.id}`)
        })
    },

    //delete
    delete(req, res) {
        Chef.delete(req.body.id, function () {
            return res.redirect(`/admin/chefs`)
        })
    }
}

// if(recipes.id == null ){
//     let recipes = false
// } else {
//     recipes = false
// }