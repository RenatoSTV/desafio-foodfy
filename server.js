const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes')
const data = require("./data.json")
const methodOverride = require('method-override')


const server = express()

server.use(express.urlencoded({ extended:true }))
server.use(express.static('public'))
server.use(methodOverride('_method'))
server.use(routes)

server.set("view engine", "njk")

nunjucks.configure("views",{
    express: server,
    autoescape: false,
    noCache: true
})

server.get("/", function(req, res){
    return res.render("index", {recipes: data.recipes})
})

server.get("/about", function(req, res){
    return res.render("about")
})

server.get("/recipes", function(req, res){
    return res.render("recipes", {recipes: data.recipes})
})

server.get("/:index", function (req, res) {
    const recipeIndex = req.params.index
    const recipe = data.recipes[recipeIndex]

    return res.render("recipe", {recipe})
})

server.listen(5000, function(){
    console.log("server is running")
})