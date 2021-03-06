const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const jwt = require('jsonwebtoken');
const validator = require('validator');
// const uuid = require('uuid/v4');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new Schema({
    email:{
        type: String
      , required: true
      , trim: true
      , minlength: 1
      , unique: true
      , validate: {
          validator: validator.isEmail,
          //validator: (value) => {
          //    validatior.isEmail(value)
          //},
          message: '{VALUE} is not a valid email'
      }
    },
    password: {
        type: String
      , required: true
      , minlength: 6
    },
    salt: {
        type: String
    },
    tokens: [{
        access: {
            type: String
          , required: true
        },
        token: {
            type: String
          , required: true
        }
    }]
});

// Instance methods
UserSchema.methods.generateAuthenticationToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({ 
            _id: user._id.toHexString(), 
            access: access 
        }, 'secret_salt').toString();

    user.tokens.push({
        access: access, 
        token:token});

    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.hashPassword = function() {
    var user = this;
    var salt = uuid(); // Generate random string '416ac246-e7ac-49ff-93b4-f7e94d997e6b'

}

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.removeToken = function(token) {
    var user = this;

    return user.update({
        $pull: {
            tokens: {
                token: token
            }
        }
    });
}

// Model methods
UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'secret_salt');
    } catch (e) {
        return Promise.reject();
        // return new Promise((resolve, reject) => {
        //     reject();
        // });
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}

UserSchema.statics.findByCredentials = function(email, password) {
    var User = this;

    return User.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    reject(err);
                }

                if (result) {
                    resolve(user);
                } else {
                    reject();
                }
            })
        });        
        //return bcrypt.compare(password, user.password);
    });
}

// Middleware
UserSchema.pre('save', function(next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, ((err, salt) => {
            bcrypt.hash(user.password, salt, ((err, hash) => {
                user.password = hash;                
                next();
            }));
        }));
    } else {
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};