const {ObjectID} = require('mongodb');
const bodyParser = require('body-parser');
const _ = require('lodash');

var {Expense} = require('./../models/expense.js');

// GET /expenses
module.exports.find = (request, response) => {
    Expense.find().then((documents) => {
        response.send({ expenses: documents });
    }).catch((e) => {
        response.status(400);
        response.send(e);
    });
}

// GET /expenses/:id
module.exports.findById = (request, response) => {
    if (!ObjectID.isValid(request.params.id)) {
        response.status(400);
        response.send('The id format is not valid');
    }
    else {
        Expense.findById(request.params.id).then((document) => {
            if (!document) {
                response.status(404);
                response.send(`Expense not found with id ${request.params.id}`);
            } else {
                response.send({ expenses: document });
            }
        }).catch((e) => {
            response.status(400);
            response.send(e);
        });
    }
}

// POST /expense
module.exports.create = (request, response) => {
    var expense = new Expense({
        item: request.body.item,
        price: request.body.price
    });

    expense.save().then((document) => {        
        response.send(document);
    }).catch((e) => {
        response.status(400);
        response.send(e);
    });
}

// DELETE /expense/:id
module.exports.delete = (request, response) => {
    if (!ObjectID.isValid(request.params.id)) {
        return response.status(400)
                       .send('The id format is not valid');        
    } 
    
    Expense.findByIdAndRemove(request.params.id).then((document) => {
        if (!document) {
            return response.status(404)
                           .send(`Expense not found with id ${request.params.id}`);
        } 

        response.send({ expenses: document });
    }).catch((e) => {
        response.status(400)
        .send(e);
    });
}

// PATCH /expense/:id
module.exports.update = (request, response) => {
    if (!ObjectID.isValid(request.params.id)) {
        return response.status(400)
                       .send('The id format is not valid');
    }

    // Use lodash to pick off items that we wish to validate
    var body = _.pick(request.body, ['item', 'price']);
    //if (Expense.isValid());

    Expense.findByIdAndUpdate(request.params.id, { $set: body }, { new: true, runValidators: true }).then((document) => {
        if (!document) {
            return response.status(404)
                           .send();
        }

        response.send({ expense: document });
    }).catch((e) => {
        response.status(400)
                .send('Error saving updates');
    });
}