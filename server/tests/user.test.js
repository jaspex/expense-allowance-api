const {User} = require('./../../models/user.js');

describe('User instance methods', () =>{
    it('hashes a cleartext password', () => {
        var user = new User({
            email: 'test@tet.com',
            password: 'password123'
        });
    
        var hash = user.generateSalt();
    });
})