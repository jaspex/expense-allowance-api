const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');
const {Expense} = require('./../models/expense.js');

// Run this before each test to clear the database
beforeEach((done) => {
    Expense.remove({}).then((done) => {
        done();
    }).catch((err) => done());
});

describe('POST /expenses', () => {
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

                Expense.find().then((expense) => {
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
                    expect(expense.length).toBe(0);
                    done();
                }).catch((error) => done(error));
            });
    });
});