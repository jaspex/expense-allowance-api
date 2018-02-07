const _ = require('lodash');
// const uuid = require('uuid/v4');

const {User} = require('./../models/user.js');

// POST /users
module.exports.create = (request, response) => {
    var body = _.pick(request.body, ['email', 'password']);
    var user = new User(body);    

    user.save().then(() => { 
        return user.generateAuthenticationToken();
    }).then((token) => {
        response
            .header('x-auth', token)
            .send(user);
    }).catch((e) => {
        response
            .status(400)
            .send(e);
    });
}

// POST /users/sign_in
module.exports.signIn = (request, response) => {
    var body = _.pick(request.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthenticationToken().then((token) => {
            response
                .header('x-auth', token)
                .send(user);
        });
    }).catch((e) => {
        response
            .status(400)
            .send();
    })
}

module.exports.signOut = (request, response) => {
    request.user.removeToken(request.token).then(() => {
        response
            .send();
    }).catch((e) => {
        response
            .status('400')
            .send();
    })
}

// GET /users/me
module.exports.me = (request, response) => {
    response.send(request.user);
}