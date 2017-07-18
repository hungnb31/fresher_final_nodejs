const app = require('../index.js');
const request = require('supertest');

describe('GET /user', () => {
    it('respond with json', (done) => {
        request(app)
            .get('/user')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});


// MAKE BETTER
// I CAN DO IT