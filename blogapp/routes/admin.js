const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
require('../models/Postagem')
const Postagem = mongoose.model('postagens')
const { eAdmin } = require('../helpers/eAdmin')

//GET
router.get('/', eAdmin, (req, res) => {
	res.render('admin/index')
})

router.get('/categorias', eAdmin, (req, res) => {
	Categoria.find()
		.sort({ date: 'desc' })
		.lean()
		.then((categorias) => {
			res.render('admin/categorias', { categorias: categorias })
		})
		.catch((err) => {
			req.flash('error_msg', 'Houve um erro ao listar as categorias')
			res.redirect('/admin')
		})
})

router.get('/categorias/add', eAdmin, (req, res) => {
	res.render('admin/addcategorias')
})

router.get('/categorias/edit/:id', eAdmin, (req, res) => {
	Categoria.findOne({ _id: req.params.id })
		.lean()
		.then((categoria) => {
			res.render('admin/editcategorias', { categoria: categoria })
		})
		.catch((err) => {
			req.flash('error_msg', 'Esta categoria não existe')
			res.redirect('/admin/categorias')
		})
})

router.get('/postagens', eAdmin, (req, res) => {
	Postagem.find()
		.lean()
		.populate('categoria')
		.sort({ data: 'desc' })
		.then((postagens) => {
			res.render('admin/postagens', { postagens: postagens })
		})
		.catch((err) => {
			req.flash('error_msg', 'Houve um erro ao listar as postagens')
			res.redirect('/admin')
		})
})

router.get('/postagens/add', eAdmin, (req, res) => {
	Categoria.find()
		.sort({ date: 'desc' })
		.lean()
		.then((categorias) => {
			res.render('admin/addpostagem', { categorias: categorias })
		})
		.catch((err) => {
			req.flash('error_msg', 'Houve um erro ao carregar o formulário')
			res.redirect('/admin')
		})
})

router.get('/postagens/edit/:id', eAdmin, (req, res) => {
	Postagem.findOne({ _id: req.params.id })
		.lean()
		.then((postagem) => {
			Categoria.find()
				.lean()
				.then((categorias) => {
					res.render('admin/editpostagens', {
						categorias: categorias,
						postagem: postagem,
					})
				})
				.catch((err) => {
					req.flash(
						'error_msg',
						'Houve um erro ao listar as categorias'
					)
					res.redirect('/admin/postagens')
				})
		})
		.catch((err) => {
			req.flash(
				'error_msg',
				'Houve um erro ao carregar o formulário de edição'
			)
			res.redirect('/admin/postagens')
		})
})

// POST
router.post('/categorias/nova', eAdmin, (req, res) => {
	var erros = []

	if (
		!req.body.nome ||
		typeof req.body.nome == undefined ||
		req.body.nome == null
	) {
		erros.push({ texto: 'Nome inválido' })
	}

	if (
		!req.body.slug ||
		typeof req.body.slug == undefined ||
		req.body.slug == null
	) {
		erros.push({ texto: 'Slug inválido' })
	}

	if (req.body.nome.length < 2) {
		erros.push({ texto: 'Nome da categoria é muito pequeno' })
	}

	if (erros.length > 0) {
		res.render('admin/addcategorias', { erros: erros })
	} else {
		const novaCategoria = {
			nome: req.body.nome,
			slug: req.body.slug,
		}
		new Categoria(novaCategoria)
			.save()
			.then(() => {
				req.flash('success_msg', 'Categoria criada com sucesso!')
				res.redirect('/admin/categorias')
			})
			.catch((err) => {
				req.flash(
					'error_msg',
					'Houve um erro ao salvar a categoria, tente novamente'
				)
				res.redirect('/admin')
			})
	}
})

router.post('/categorias/edit', eAdmin, (req, res) => {
	Categoria.findOne({ _id: req.body.id })
		.then((categoria) => {
			var erros = []

			if (
				!req.body.nome ||
				typeof req.body.nome == undefined ||
				req.body.nome == null
			) {
				erros.push({ texto: 'Nome inválido' })
			}

			if (
				!req.body.slug ||
				typeof req.body.slug == undefined ||
				req.body.slug == null
			) {
				erros.push({ texto: 'Slug inválido' })
			}

			if (req.body.nome.length < 2) {
				erros.push({ texto: 'Nome da categoria é muito pequeno' })
			}

			if (erros.length > 0) {
				Categoria.findOne({ _id: req.body.id })
					.lean()
					.then((categoria) => {
						res.render('admin/editcategorias', {
							categoria: categoria,
						})
					})
					.catch((err) => {
						req.flash('error_msg', 'Erro ao pegar os dados')
						res.redirect('admin/categorias')
					})
			} else {
				categoria.nome = req.body.nome
				categoria.slug = req.body.slug

				categoria
					.save()
					.then(() => {
						req.flash(
							'success_msg',
							'Categoria editada com sucesso!'
						)
						res.redirect('/admin/categorias')
					})
					.catch((err) => {
						req.flash(
							'error_msg',
							'Houve um erro interno ao salvar edição da categoria'
						)
						res.redirect('/admin/categorias')
					})
			}
		})
		.catch((err) => {
			req.flash('error_msg', 'Houve um erro ao editar a categoria')
			res.redirect('/admin/categorias')
		})
})

router.post('/categorias/deletar', eAdmin, (req, res) => {
	Categoria.deleteOne({ _id: req.body.id })
		.then(() => {
			req.flash('success_msg', 'Categoria deletada com sucesso!')
			res.redirect('/admin/categorias')
		})
		.catch((err) => {
			req.flash('error_msg', 'Houve um erro ao deletar a categoria')
			res.redirect('/admin/categorias')
		})
})

router.post('/postagens/nova', eAdmin, (req, res) => {
	var erros = []

	function validacao() {
		if (
			!req.body.titulo ||
			typeof req.body.titulo == undefined ||
			req.body.titulo == null
		) {
			erros.push({ texto: 'titulo inválido' })
		}

		if (
			!req.body.slug ||
			typeof req.body.slug == undefined ||
			req.body.slug == null
		) {
			erros.push({ texto: 'Slug inválido' })
		}

		if (
			!req.body.descricao ||
			typeof req.body.descricao == undefined ||
			req.body.descricao == null
		) {
			erros.push({ texto: 'descricao inválido' })
		}

		if (
			!req.body.conteudo ||
			typeof req.body.conteudo == undefined ||
			req.body.conteudo == null
		) {
			erros.push({ texto: 'conteudo inválido' })
		}

		if (req.body.titulo.length < 2) {
			erros.push({ texto: 'titulo da categoria é muito pequeno' })
		}

		if (req.body.descricao.length < 2) {
			erros.push({ texto: 'descricao da categoria é muito pequeno' })
		}

		if (req.body.conteudo.length < 10) {
			erros.push({ texto: 'conteudo da categoria é muito pequeno' })
		}
	}
	validacao()

	if (req.body.categoria == '0') {
		erros.push({ texto: 'Categoria inválida, registre uma categoria' })
	}

	if (erros.length > 0) {
		res.render('admin/addpostagem', { erros: erros })
	} else {
		const novaPostagem = {
			titulo: req.body.titulo,
			descricao: req.body.descricao,
			conteudo: req.body.conteudo,
			categoria: req.body.categoria,
			slug: req.body.slug,
		}

		new Postagem(novaPostagem)
			.save()
			.then(() => {
				req.flash('success_msg', 'Postagem criada com sucesso!')
				res.redirect('/admin/postagens')
			})
			.catch((err) => {
				req.flash(
					'error_msg',
					'Houve um erro ao salvar a postagem, tente novamente'
				)
				res.redirect('/admin/postagens')
			})
	}
})

router.post('/postagens/edit', eAdmin, (req, res) => {
	Postagem.findOne({ _id: req.body.id })
		.then((postagem) => {
			var erros = []

			function validacao() {
				if (
					!req.body.titulo ||
					typeof req.body.titulo == undefined ||
					req.body.titulo == null
				) {
					erros.push({ texto: 'titulo inválido' })
				}

				if (
					!req.body.slug ||
					typeof req.body.slug == undefined ||
					req.body.slug == null
				) {
					erros.push({ texto: 'Slug inválido' })
				}

				if (
					!req.body.descricao ||
					typeof req.body.descricao == undefined ||
					req.body.descricao == null
				) {
					erros.push({ texto: 'descricao inválido' })
				}

				if (
					!req.body.conteudo ||
					typeof req.body.conteudo == undefined ||
					req.body.conteudo == null
				) {
					erros.push({ texto: 'conteudo inválido' })
				}

				if (req.body.titulo.length < 2) {
					erros.push({ texto: 'titulo da categoria é muito pequeno' })
				}

				if (req.body.descricao.length < 2) {
					erros.push({
						texto: 'descricao da categoria é muito pequeno',
					})
				}

				if (req.body.conteudo.length < 10) {
					erros.push({
						texto: 'conteudo da categoria é muito pequeno',
					})
				}
			}
			validacao()

			if (req.body.categoria == '0') {
				erros.push({
					texto: 'Categoria inválida, registre uma categoria',
				})
			}

			if (erros.length > 0) {
				Postagem.findOne({ _id: req.body.id })
					.lean()
					.then((postagem) => {
						Categoria.find()
							.lean()
							.then((categoria) => {
								res.render('admin/editpostagens', {
									categorias: categorias,
									postagem: postagem,
								})
							})
							.catch((err) => {
								req.flash(
									'error_msg',
									'Erro ao pegar os dados das categorias'
								)
								res.redirect('admin/postagens')
							})
					})
					.catch((err) => {
						req.flash(
							'error_msg',
							'Erro ao pegar os dados da postagem'
						)
						res.redirect('admin/postagens')
					})
			} else {
				postagem.titulo = req.body.titulo
				postagem.slug = req.body.slug
				postagem.descricao = req.body.descricao
				postagem.conteudo = req.body.conteudo
				postagem.categoria = req.body.categoria

				postagem
					.save()
					.then(() => {
						req.flash(
							'success_msg',
							'Postagem editada com sucesso!'
						)
						res.redirect('/admin/postagens')
					})
					.catch((err) => {
						req.flash(
							'error_msg',
							'Houve um erro interno ao salvar edição da postagem'
						)
						res.redirect('/admin/postagens')
					})
			}
		})
		.catch((err) => {
			req.flash('error_msg', 'Houve um erro ao editar a postagem')
			res.redirect('/admin/postagens')
		})
})

router.post('/postagens/deletar', eAdmin, (req, res) => {
	Postagem.deleteOne({ _id: req.body.id })
		.then(() => {
			req.flash('success_msg', 'Postagem deletada com sucesso!')
			res.redirect('/admin/postagens')
		})
		.catch((err) => {
			req.flash('error_msg', 'Houve um erro ao deletar a postagem')
			res.redirect('/admin/categorias')
		})
})

module.exports = router
