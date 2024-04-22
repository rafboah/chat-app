const request = require('supertest');
const app = require('../server.js')

describe('GET /', () => {
    it('responds with text', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBe('Hello World!');
    });
});