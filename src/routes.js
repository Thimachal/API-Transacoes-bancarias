const express = require('express');
const {cadastroUser} = require('./controllers/users');
const {login} = require('./controllers/login');


const routes = express();

routes.post('/user', cadastroUser);
routes.post('/login', login);

module.exports = routes;