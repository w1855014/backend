const request = require('supertest');
const sorted = require('jest-sorted');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');

afterAll(() =>
{
    db.end();
});

beforeEach(() =>
{
    return seed(testData);
});

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

    describe('POST /api/topics', () =>
    {
        test('201: responds with posted object containing expected values', () =>
        {
            return request(app)
            .post('/api/topics')
            .send({slug: "dogs", description: "Not cats"})
            .expect(201)
            .then(({body}) =>
            {
                const {topic} = body;
                expect(topic).toBeInstanceOf(Object);
                expect(topic).toEqual(
                {
                    slug: "dogs",
                    description: "Not cats"
                });
            })
        });
        test('400: returns bad request', () =>
        {
            return request(app)
            .post('/api/topics')
            .send({slug: null, body: "Not cats"})
            .expect(400)
            .then(({body}) =>
            {
                const {msg} = body;
                expect(msg).toBe("Bad request.")
            })
        });
    });
});

describe('articles', () =>
{
    describe('GET /api/articles', () =>
    {
        test('200: responds with array of articles', () =>
        {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) =>
            {
                const {articles} = body;
                expect(articles).toBeInstanceOf(Array);
                expect(articles.length).toBe(12);
                articles.forEach(article =>
                {
                    expect(article).toEqual(expect.objectContaining
                    ({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number)
                    }));
                });
            });
        });
        test('200: sorts array by date in DESC order by default', () =>

        {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) =>
            {
                const {articles} = body;
                expect(articles).toBeSortedBy('created_at', {descending: true});
            });
        });
        test('200: sorts array by specified column', () =>
        {
            return request(app)
            .get('/api/articles?sort_by=author')
            .expect(200)
            .then(({body}) =>
            {
                const {articles} = body;
                expect(articles).toBeSortedBy("author", {descending:true});
            });
        });
        test('200: orders array by specified parameter', () =>
        {
            return request(app)
            .get('/api/articles?order=ASC')
            .expect(200)
            .then(({body}) =>
            {
                const {articles} = body;
                expect(articles).toBeSortedBy("created_at", {descending:false});
            });
        });

        test('200: filters by specified topic query', () =>
        {
            return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(({body}) =>
            {
                const {articles} = body;
                expect(articles.length).toBe(11);
                articles.forEach(article =>
                {
                    expect(article.topic).toBe("mitch");
                });
            })
        });
    });

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
                    votes: 100,
                    comment_count: "11"
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

    describe('POST /api/articles', () =>
    {
        test('201: responds with posted object containing expected values', () =>
        {
            return request(app)
            .post('/api/articles')
            .send({title: "Test Title", topic: "cats", author: "butter_bridge", body: "Test comment."})
            .expect(201)
            .then(({body}) =>
            {
                const {article} = body;
                expect(article).toBeInstanceOf(Object);
                expect(article).toEqual(
                {
                    article_id: 13,
                    title: "Test Title",
                    topic: "cats",
                    author: "butter_bridge",
                    body: "Test comment.",
                    created_at: expect.any(String),
                    votes: 0
                });
            })
        });
        test('400: returns bad request', () =>
        {
            return request(app)
            .post('/api/articles')
            .send({title: "Test Title", topic: "cats", author: "butter_bridge", body: null})
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
            .post('/api/articles')
            .send({title: "Test Title", topic: "cats", author: "butter", body: "Test comment."})
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
                expect(msg).toBe(`"inc_votes" must be a number`);
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
    });

    describe('POST /api/articles/:article_id/comments', () =>
    {
        test('201: posts new comment with specified values', () =>
        {
            return request(app)
            .post('/api/articles/6/comments')
            .send({username: "icellusedkars", body: "Amazing."})
            .expect(201)
            .then(({body}) =>
            {
                const {comment} = body;
                expect(comment).toBeInstanceOf(Object);
                expect(comment).toEqual(
                {
                    comment_id: 19,
                    body: "Amazing.",
                    article_id: 6,
                    author: "icellusedkars",
                    votes: 0,
                    created_at: expect.any(String)
                });
            });
        });
        test('400: returns bad request', () =>
        {
            return request(app)
            .post('/api/articles/6/comments')
            .send({username: "icellusedkars", body: null})
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
            .post('/api/articles/999/comments')
            .send({username: "icellusedkars", body: "Amazing."})
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

    describe('GET /api/users/:username', () =>
    {
        test('200: responds with object containing expected values', () =>
        {
            return request(app)
            .get('/api/users/butter_bridge')
            .expect(200)
            .then(({body}) =>
            {
                const {user} = body;
                expect(user).toBeInstanceOf(Object);
                expect(user).toEqual
                ({
                    username: "butter_bridge",
                    name: "jonny",
                    avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
                });
            });
        });
    });
});

describe('comments', () =>
{
    describe('PATCH /api/comments/:comment_id', () =>
    {
        test('200: responds with updated object containing expected values', () =>
        {
            return request(app)
            .patch('/api/comments/1')
            .send({inc_votes: 1})
            .expect(200)
            .then(({body}) =>
            {
                const {comment} = body;
                expect(comment).toBeInstanceOf(Object);
                expect(comment).toEqual(
                {
                    comment_id: 1,
                    body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                    votes: 17,
                    author: "butter_bridge",
                    article_id: 9,
                    created_at: "2020-04-06T12:17:00.000Z"
                });
            });
        });
        test('400: returns bad request', () =>
        {
            return request(app)
            .patch('/api/comments/1')
            .send({inc_votes: null})
            .expect(400)
            .then(({body}) =>
            {
                const {msg} = body;
                expect(msg).toBe(`"inc_votes" must be a number`);
            })
        });
        test('404: returns not found', () =>
        {
            return request(app)
            .patch('/api/comments/999')
            .send({inc_votes: 1})
            .expect(404)
            .then(({body}) =>
            {
                const {msg} = body;
                expect(msg).toBe("Not found.")
            })
        });
    });

    describe('DELETE /api/comments/:comment_id', () =>
    {
        test('204: removes comment with specified id', () =>
        {
            return request(app)
            .delete('/api/comments/1')
            .expect(204);
        });
        test('404: returns not found', () =>
        {
            return request(app)
            .delete('/api/comments/999')
            .expect(404)
            .then(({body}) =>
            {
                const {msg} = body;
                expect(msg).toBe("Not found.")
            })
        });
    });
});