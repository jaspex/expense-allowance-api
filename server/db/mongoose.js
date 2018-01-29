const mongoose = require('mongoose');
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/Expense';

mongoose.Promise = global.Promise;
mongoose.connect(mongoUri);

// Shorthand version
//module.exports = { mongoose };
module.exports = {
    mongoose: mongoose
};