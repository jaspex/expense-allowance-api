const mongoose = require('mongoose');

var Expense = mongoose.model('Expense', {
    item: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    purchasedOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = {Expense};