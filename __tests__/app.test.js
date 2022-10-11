const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');

afterAll(() =>
{
    db.end();
})


describe('invalid endpoint', () =>
{
    test('404: returns invalid endpoint', () =>
    {
        return request(app)
        .get('/any')
        .expect(404)
        .then(({body}) =>
        {
            const {msg} = body;
            expect(msg).toBe("Invalid endpoint.")
        })
    })
})

describe('topics', () =>
{
    describe('GET /api/topics', () =>
    {
        test('200: responds with array of topics', () =>
        {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({body}) =>
            {
                const {topics} = body;
                expect(topics).toBeInstanceOf(Array);
                expect(topics.length).toBe(3);
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

describe('articles', () =>
{
    describe('GET /api/articles/:article_id', () =>
    {
        test('200: responds with object containing expected values', () =>
        {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({body}) =>
            {
                const {article} = body;
                expect(article).toBeInstanceOf(Object);
                expect(article).toEqual(
                {
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 100
                });
            });
        });
        test('400: returns bad request', () =>
        {
            return request(app)
            .patch('/api/articles/any')
            .expect(400)
            .then(({body}) =>
            {
                const {msg} = body;
                expect(msg).toBe("Bad request.")
            })
        });
    });

    describe('GET /api/articles/:article_id/comments', () =>
    {
        test('200: responds with array of comments', () =>
        {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({body}) =>
            {
                const {comments} = body;
                expect(comments).toBeInstanceOf(Array);
                expect(comments.length).toBe(11);
                comments.forEach(comment =>
                {
                    expect(comment).toEqual(expect.objectContaining
                    ({
                        comment_id: expect.any(Number),
                        body: expect.any(String),
                        votes: expect.any(Number),    
                        author: expect.any(String),
                        article_id: expect.any(Number),
                        created_at: expect.any(String)
                    }));
                });
            });
        })
        test('200: filters comments by article', () =>
        {
            return request(app)
            .get('/api/articles/6/comments')
            .expect(200)
            .then(({body}) =>
            {
                const {comments} = body;
                comments.forEach(comment =>
                {
                    expect(comment.article_id).toBe(6);
                });
            });
        });
        test('404: returns not found', () =>
        {
            return request(app)
            .get('/api/articles/999/comments')
            .expect(404)
            .then(({body}) =>
            {
                const {msg} = body;
                expect(msg).toBe("Not found.")
            })
        });
    });

    describe('PATCH /api/articles/:article_id', () =>
    {
        test('200: responds with updated object containing expected values', () =>
        {
            return request(app)
            .patch('/api/articles/1')
            .send({inc_votes: 1})
            .expect(200)
            .then(({body}) =>
            {
                const {article} = body;
                expect(article).toBeInstanceOf(Object);
                expect(article).toEqual(
                {
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 101
                });
            });
        });
        test('400: returns bad request', () =>
        {
            return request(app)
            .patch('/api/articles/1')
            .send({inc_votes: null})
            .expect(400)
            .then(({body}) =>
            {
                const {msg} = body;
                expect(msg).toBe("Bad request.")
            })
        });
        test('404: returns not found', () =>
        {
            return request(app)
            .patch('/api/articles/999')
            .send({inc_votes: 1})
            .expect(404)
            .then(({body}) =>
            {
                const {msg} = body;
                expect(msg).toBe("Not found.")
            })
        });
    })
});

describe('users', () =>
{
    describe('GET /api/users', () =>
    {
        test('200: responds with array of users', () =>
        {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then(({body}) =>
            {
                const {users} = body;
                expect(users).toBeInstanceOf(Array);
                expect(users.length).toBeTruthy();
                users.forEach(user =>
                {
                    expect(user).toEqual(expect.objectContaining
                    ({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)    
                    }));
                });
            });
        });
    });
});