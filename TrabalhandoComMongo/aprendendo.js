const mongoose = require("mongoose");

// Configuração Mongoose
mongoose.Promise = global.Promise;
mongoose
	.connect("mongodb://localhost/aprendendo", {
		useNewUrlParser: true,
	})
	.then(() => {
		console.log("MongoDB Conectado!");
	})
	.catch((err) => {
		console.log("Houve um erro ao se conectar ao mongoDB: " + err);
	});
// Model - Usuários
// Definindo o Model
const UsuarioSchema = mongoose.Schema({
	nome: {
		type: String,
		require: true,
	},
	sobrenome: {
		type: String,
		require: true,
	},
	email: {
		type: String,
		require: true,
	},
	idade: {
		type: Number,
		require: true,
	},
	pais: {
		type: String,
	},
});
// Definindo a Collection
// mongoose.model("usuarios", UsuarioSchema);

// // Manipulando ou criando um registro/usuário
// const Filipe = mongoose.model("usuarios");

// new Filipe({
// 	nome: "Filipe",
// 	sobrenome: "Lemos",
// 	email: "email@email.com",
// 	idade: 24,
// 	pais: "Brasil",
// })
// 	.save()
// 	.then(() => {
// 		console.log("Usuário criado com sucesso");
// 	})
// 	.catch((err) => {
// 		console.log("Houve um erro ao registrar o usuário: " + err);
// 	});

//  Das linhas 37 até a 55 pode ser substituído por:
const Filipe = mongoose.model("usuarios", UsuarioSchema);
Filipe.create({
	nome: "Jhon",
	sobrenome: "Doe",
	email: "jhon@doe.com",
	idade: 34,
	pais: "EUA",
})
	.then(() => {
		console.log("Usuário criado com sucesso");
	})
	.catch((err) => {
		console.log("Houve um erro ao registrar o usuário: " + err);
	});
