const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');
const {Expense} = require('./../../models/expense.js');
const {User} = require('./../../models/user.js');

const testData = [{
        item: 'Item 1',
        price: 9.99
    },
    {
        item: 'Item 2',
        price: 0.00
    },
    {
        item: 'Item 3',
        price: 12.95
    }];

describe('Expenses', () => {
    // Run this before each test to clear the database
    beforeEach((done) => {
        Expense.remove({}).then(() => {
            return Expense.insertMany(testData);
        }).then(() => done());
    });

    describe('#POST /expenses', () => {
        it('should create a new expense', (done) => {
            var text = 'New expense item';
            var price = 9.99;
    
            request(app)
                .post('/expenses')
                .send({ item: text, price })
                .expect(200)
                .expect((response) => {
                    expect(response.body.item).toBe(text);
                    expect(response.body.price).toBe(price);
                })
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }
    
                    Expense.find({ item: text }).then((expense) => {
                        expect(expense.length).toBe(1);
                        expect(expense[0].item).toBe(text);
                        expect(expense[0].price).toBe(price);
                        done();
                    }).catch((e) => done(e));
                });
        });
    
        it('should not create an expense with invalid data', (done) => {
            request(app)
                .post('/expenses')
                .send()
                .expect(400)
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }
    
                    Expense.find().then((expense) => {
                        expect(expense.length).toBe(testData.length);
                        done();
                    }).catch((e) => done(e));
                });
        });
    });

    describe('#GET /expenses', () => {
        it('should return an array of expenses', (done) => {
            request(app)
                .get('/expenses')
                .send()
                .expect(200)
                .expect((response) => {
                    expect(response.body).toIncludeKey('expenses');
                    expect(response.body.expenses.length).toBe(testData.length);
                })
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }

                    Expense.find().then((expenses) => {
                        expect(expenses.length).toBe(testData.length);
                        done();
                    }).catch((e) => done(e));
                });
        });
    });
});

describe('Users', () => {
    beforeEach((done) => {
        User.remove({}).then(() => {  
            // Add dummy data here

            done();
        }).catch((e) => done(e));
    });

    describe('#POST', () => {
        it('should create a new user', (done) => {
            var email = 'neilrudd@gmail.com';
            var password = 'password123';

            request(app)
                .post('/users')
                .send({ email, password })
                .expect(200)
                .expect('')
                .expect((response) => {
                    expect(response.body.email).toBe(email)
                })
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }

                    User.find({ email }).then((user) => {
                        expect(user.length).toBe(1);
                        expect(user[0].email).toBe(email);

                        done();
                    }).catch((e) => done(e));
                });
        });

        it('should not create a user with invalid data', (done) => {
            request(app)
                .post('/users')
                .send()
                .expect(400)
                .end((err, esponse) => {
                    if (err){
                        return done(err);
                    }

                    User.find().then((user) => {
                        expect(user.length).toBe(0);
                        done();
                    }).catch((e) => done(e));
                })
        });

        it('should not create a user with an invalid email address', (done) => {
            var email = 'myemailaddress';

            request(app)
                .post('/users')
                .send({email})
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    User.find().then((user) => {
                        expect(user.length).toBe(0);
                        done();
                    }).catch((e) => done(e));
                });
        });
    });
});