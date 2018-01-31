require('./config.js');

var {ObjectID} = require('mongodb');
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');

var expenseController = require('./../controllers/expensesController');
var userController = require('./../controllers/usersController.js');
var {authenticate} = require('./middleware/authenticate.js');

const port = process.env.PORT;

var app = express();

// Configure middleware
app.use(bodyParser.json());

// Configure Routes
app.get('/', (request, response) => {
    response.send('');
});

// POST /expenses
app.post('/expenses', (request, response) => {
    expenseController.create(request, response);
});

// DELETE /expenses
app.delete('/expenses/:id', (request, response) => {
    expenseController.delete(request, response);
});

// GET /expenses
app.get('/expenses', (request, response) => {
    expenseController.find(request, response);
});

// GET /expenses/{id}
app.get('/expenses/:id', (request, response) => {
    expenseController.findById(request, response);
});

// PATCH /expenses/{id}
app.patch('/expenses/:id', (request, response) => {
    expenseController.update(request, response);
});

// POST /users
app.post('/users', (request, response) => {
    userController.create(request, response);
});

app.get('/users/me', authenticate, (request, response) => {
    response.send(request.user);
});

app.listen(port, () => {
    console.log(`Started on port ${process.env.PORT} running as ${process.env.NODE_ENV}`);
});

module.exports = { app };
