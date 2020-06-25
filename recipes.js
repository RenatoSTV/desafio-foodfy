const fs = require('fs')
const data = require('./data.json')

//index
exports.index =  function (req, res) {
    
    return res.render("admin/admin_recipes")
}

//show
exports.show = function(req,res){
    const { id } = req.params

    const foundRecipe = data.recipes.find(function(recipe){
        return recipe.id == id
    })

    if (!foundRecipe) return res.send("Recipe not found!")

    const recipe = {
        ...foundRecipe,
    }

    return res.render("admin/recipe", { recipe })

}

//create
exports.create = function(req,res){

    return res.render("admin/create")
}

//edit

//post
exports.post = function (req, res) {
    const keys = Object.keys(req.body)

    for(key of keys){
        if (req.body[key] == ""){
            return res.send("Please, fill all fields")}
    }

    data.recipes.push(req.body)

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error!")
        
        return res.redirect("/admin/recipes")
    }) 
}