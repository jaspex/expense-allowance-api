var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Expense');

// Shorthand version
//module.exports = { mongoose };
module.exports = {
    mongoose: mongoose
};