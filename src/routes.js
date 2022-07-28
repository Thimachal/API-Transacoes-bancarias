const express = require('express');
const {cadastroUser} = require('./controllers/users');


const routes = express();

routes.post('/user', cadastroUser);

module.exports = routes;