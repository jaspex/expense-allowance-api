const mongoose = require('mongoose');
const mongoUri = process.env.MONGODB_URI;

mongoose.Promise = global.Promise;
mongoose.connect(mongoUri);

// Shorthand version
//module.exports = { mongoose };
module.exports = {
    mongoose: mongoose
};