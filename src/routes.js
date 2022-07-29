const express = require('express');
const {cadastroUser, getUser, updateUser} = require('./controllers/users');
const {listCategories} = require('./controllers/categories');
const {login} = require('./controllers/login');
const {filter} = require('./intermediary/authentication');


const routes = express();
//rotas de cadastro usuário e login
routes.post('/user', cadastroUser);
routes.post('/login', login);

//middleware para autenticação
routes.use(filter);
//rotas de usuário
routes.get('/user', getUser);
routes.put('/user', updateUser);
//rotas de categorias
routes.get('/categories', listCategories);

module.exports = routes;