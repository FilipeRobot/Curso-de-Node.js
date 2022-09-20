// Carregando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')
// Configurações
// Boddy Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// Handlebars
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
// mongoose
mongoose.Promise = global.Promise
mongoose
	.connect('mongodb://localhost/blogapp', {
		useNewUrlParser: true,
	})
	.then(() => {
		console.log('Conectado ao mongo')
	})
	.catch((err) => {
		console.log('Houve um erro ao se conectar ao mongo: ' + err)
	})
// Public
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
	console.log('Oi eu sou um middlewere!')
	next()
})
// Rotas
app.get('/', (req, res) => {
	res.send('Rota principal')
})

app.get('/posts', (req, res) => {
	res.send('Lista de posts')
})

app.use('/admin', admin)
// Outros
const PORT = 8081
app.listen(PORT, () => {
	console.log('Servidor rodando!')
})
