const _ = require('lodash');
const uuid = require('uuid/v4');

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
