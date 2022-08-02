const express = require('express');
const {cadastroUser, getUser, updateUser} = require('./controllers/users');
const {listCategories} = require('./controllers/categories');
const {listTransactions,detailTransaction, cadastroTransaction, updateTransaction, deleteTransaction} = require('./controllers/transactions');
const {login} = require('./controllers/login');
const {filter} = require('./intermediary/authentication');

const routes = express();

//rotas de cadastro de usuário e login
routes.post('/user', cadastroUser);
routes.post('/login', login);

//middleware para autenticação
routes.use(filter);

//rotas de usuário
routes.get('/user', getUser);
routes.put('/user', updateUser);

//rotas de categorias
routes.get('/categories', listCategories);

//rotas de transações
routes.get('/transactions', listTransactions);
routes.get('/transactions/:id', detailTransaction);
routes.post('/transactions', cadastroTransaction);
routes.put('/transactions/:id', updateTransaction);
routes.delete('/transactions/:id', deleteTransaction);

module.exports = routes;