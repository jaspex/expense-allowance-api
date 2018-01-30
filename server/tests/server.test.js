const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');
const {Expense} = require('./../models/expense.js');

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

// Run this before each test to clear the database
beforeEach((done) => {
    Expense.remove({}).then((done) => {
        Expense.insertMany(testData);

        done();
    }).catch((err) => done());
});

describe('Expenses', () => {
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
                    }).catch((err) => {
                        done(err);
                    });
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
                    }).catch((error) => done(error));
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