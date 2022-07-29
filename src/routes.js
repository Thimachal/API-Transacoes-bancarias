const express = require('express');
const {cadastroUser, getUser} = require('./controllers/users');
const {login} = require('./controllers/login');
const {filter} = require('./intermediary/authentication');


const routes = express();

routes.post('/user', cadastroUser);
routes.post('/login', login);

routes.use(filter);
routes.get('/user', getUser);

module.exports = routes;