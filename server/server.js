var {ObjectID} = require('mongodb');

var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Expense} = require('./models/expense');
var {User} = require('./models/user');

var expenseController = require('./../controllers/expensesController');

var app = express();

// Configure middleware
app.use(bodyParser.json());

// POST /expenses
app.post('/expenses', (request, response) => {
    expenseController.create(request, response);
});

// DELEETE /expenses
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

// PUT
app.patch('/expenses/:id', (request, response) => {
    expenseController.update(request, response);
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});



