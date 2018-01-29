const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const jwt = require('jsonwebtoken');

var UserSchema = new Schema({
    email:{
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// Instance methods
UserSchema.methods.generateAuthenticationToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({ 
        _id: use._id.toHexString(), 
        access: access }, 'secret_salt').toString();
    
    user.tokens.push({
        access: access, 
        token:token});

    return user.save().then(() => {
        return token;
    });
};

var User = mongoose.model('User', UserSchema);

module.exports = {User};