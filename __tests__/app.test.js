const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');

afterAll(() =>
{
    db.end();
})

describe('topics', () =>
{
    describe.only('GET /api/topics', () =>
    {
        test('200: responds with array of topics', () =>
        {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({body: topics}) =>
            {
                expect(topics).toBeInstanceOf(Array)
                topics.forEach(topic =>
                {
                    expect(topic).toEqual(expect.objectContaining
                    ({
                        slug: expect.any(String),
                        description: expect.any(String)    
                    }));
                });
            });
        });
    });
});