const _ = require('lodash');

const {User} = require('./../models/user.js');

// POST /users
module.exports.create = (request, response) => {
    var body = _.pick(request.body, ['email', 'password']);
    var user = new User(body);

    user.save().then((user) => {        
        response.send(user);
    }).catch((e) => {
        response.status(400);
        response.send(e);
    });
}