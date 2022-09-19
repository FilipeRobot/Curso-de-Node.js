const express = require("express")
const app = express()
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const Post = require("./models/Post")
const { where } = require("sequelize")

// Config
// Templete Engine
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
// Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Rotas

    // GET
        app.get('/', function(req, res){
            Post.findAll({order: [['id', 'DESC']]}).then(function(posts) {
                res.render('home', {posts: posts})
            })
        })
        app.get('/cad', function (req, res) {
            res.render('formulario')
        })
        app.get('/deletar/:id', function(req, res){
            Post.destroy({where: {'id': req.params.id}}).then(function(){
                res.redirect('/')
            }).catch(function(err){
                res.send("Esta postagem não existe!")
            })
        })

    // POST
        app.post('/add', function (req, res) {
            Post.create({
                titulo: req.body.titulo,
                conteudo: req.body.conteudo
            }).then(function () {
                res.redirect('/')
            }).catch(function (err) {
                res.send("Houve um erro: " + err)
            })
        })

// Rodar Aplicação
app.listen(8081, function () {
    console.log("Servidor rodando na url http://localhost:8081")
})