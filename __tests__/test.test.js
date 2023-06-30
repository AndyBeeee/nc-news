const request = require('supertest')
const app = require('../db/app')
const seed = require('../db/seeds/seed')
const data = require("../db/data/test-data/index")
const db = require("../db/connection.js")
const endpoints = require('../endpoints.json')
require('jest-sorted')


beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    return db.end()
})

describe('Invalid GET paths return a 404 error', () => {
    test('Invalid paths return a 404 error', () => {
    return request(app)
    .get('/invalid/path')
    .expect(404)
    .then(({ body }) => {
    expect(body).toEqual({ status: 404, msg: 'Not Found' })
      })
  })
})

describe('GET /api/topics', () => {
    test('Status code 200 returned when passed a get request', () => {
    return request(app)
        .get("/api/topics") 
        .expect(200)
    })
    test('An array of data returned when passed a get request', () => {
        return request(app)
        .get("/api/topics") 
        .then(({ body }) => {
        expect(body.topics).toBeInstanceOf(Array)
        })
    })
    test('The correct length of data is returned when passed a get request', () => {
        return request(app)
        .get("/api/topics")
        .then(({ body }) => {
        expect(body.topics.length).toBe(data.topicData.length)
        })
    })
    test('The correct properties and data are returned when passed a get request', () => {
        return request(app)
        .get("/api/topics")
        .then(({ body }) => {
        body.topics.forEach(topic => {
        expect(topic).toHaveProperty('slug')
        expect(topic).toHaveProperty('description')
        expect(body.topics[0]).toMatchObject({
            description: 'The man, the Mitch, the legend',
            slug: 'mitch'
          })
    })
})
})
})
describe('GET /api', () => {
    test('Status code 200 returned', () => {
        return request(app)
        .get('/api')
        .expect(200)
    })
    test('Request responds with an object describing all the available endpoints', () => {
        return request(app)
        .get('/api')
        .then(({ body }) => {
        expect(body).toEqual(endpoints)
    })
})
})
describe('GET /api/articles/:article_id', () => {
    test('Status code 200 returned', () => {
        return request(app)
        .get('/api/articles/2')
        .expect(200)
    })
    test('Request responds with an article in the correct format', () => {
        const expectedArticle = {
            author: "icellusedkars",
            title: "Sony Vaio; or, The Laptop",
            article_id: 2,
            body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
            topic: "mitch",
            created_at: "2020-10-16T05:03:00.000Z",
            votes: 0,
            article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          }
        return request(app)
        .get('/api/articles/2')
        .then(({ body }) => {
            expect(body.article).toEqual(expectedArticle)
        })
    })
    test('Request responds with a status code 404 when passed a non-existing article_id', () => {
        return request(app)
        .get('/api/articles/999') 
        .expect(404)
        .then(({ body }) => {
        expect(body.msg).toEqual('Not Found')
        })
    })
    test('Request responds with a status code 400 when passed an invalid article_id', () => {
    return request(app)
        .get('/api/articles/notAnId')
        .expect(400)
        .then(({ body }) => {
        expect(body.msg).toEqual('Bad request')
        })
    })
 })

describe('GET /api/articles', () => {
    test('Status code 200 returned', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        })

    test('Request responds with articles that have the correct properties and a comment_count', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toHaveLength(13)
            body.articles.forEach(article => {
            expect(article).toMatchObject({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number)
              })
            })
        })
    })

    test('Request responds with articles sorted by date in descending order', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body: { articles } }) => {
            expect(articles.length).toBe(13)
            expect(articles.map(article => article.created_at)).toBeSorted({ descending: true })
        })
    })
})    

describe('GET /api/articles/:article_id/comments', () => {
    test('Status code 200 returned', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        })

    test('Request responds with comments in an array that have the correct properties', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
            expect(body.comments).toHaveLength(11)
            expect(body.comments).toBeInstanceOf(Array)
            body.comments.forEach(comment => {
            expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                article_id: expect.any(Number),
                })
            })
        })
    })
    test('Request responds with comments sorted by date in descending order', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body: { comments } }) => {
            expect(comments.length).toBe(11)
            expect(comments.map(article => comments.created_at)).toBeSorted({ descending: true })
        })
    })
    test('Request responds with a status code 404 when passed a non-existing article_id', () => {
        return request(app)
        .get('/api/articles/999/comments') 
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toEqual('Not Found')
        })
    })
    test('Request responds with a status code 400 when passed an invalid article_id', () => {
    return request(app)
        .get('/api/articles/notAnId/comments')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toEqual('Bad request')
        })
    })
    test('Request responds with an empty array for an existing article with no comments', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({ body }) => {
            expect(body.comments).toEqual([]);
        })
    })
})

describe('POST /api/articles/:article_id/comments', () => {
    test('Status code 201 returned', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({
            username: "butter_bridge",
            body: "new comment!"
        })
        .expect(201)
    })
    test('Posts a new comment with the correct data and a comment_id', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({
            username: "butter_bridge",
            body: "new comment!"
        })
        .then(({ body }) => {
            expect(body.comment).toHaveProperty('comment_id');
            expect(body.comment.author).toBe('butter_bridge');
            expect(body.comment.body).toBe('new comment!');
        })       
    })
    test('Post responds with a status code 404 when passed a non-existing article_id', () => {
        return request(app)
        .post('/api/articles/999/comments') 
        .send({
            username: "butter_bridge",
            body: "new comment!"
        })
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toEqual('Not Found')
        })
    })
    test('Post responds with a status code 400 when passed an invalid article_id', () => {
        return request(app)
        .post('/api/articles/notAnId/comments')
        .send({
            username: "butter_bridge",
            body: "new comment!"
        })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toEqual('Bad request')
        })
    })
    test('Post responds with a status code 400 when passed a post with missing fields', () => {
        return request(app)
        .post('/api/articles/notAnId/comments')
        .send({
            username: "butter_bridge"
        })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toEqual('Bad request')
        })
    })
    test('Post responds with a status code 400 when posted by a invalid username', () => {
        return request(app)
        .post('/api/articles/notAnId/comments')
        .send({
            username: "NotAUsername",
            body: "new comment!"
        })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toEqual('Bad request')
        })
    })
    test('POST responds with a status code 201 and the correct properties when passed unnecessary properties', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({
            username: "butter_bridge",
            body: "new comment!",
            unnecessaryProperty: "This property is unnecessary",
        })
        .expect(201)
        .then(({ body }) => {
        expect(body.comment).toMatchObject({
            comment_id: expect.any(Number),
            author: "butter_bridge",
            body: "new comment!",
            article_id: 1,
            votes: 0,
            created_at: expect.any(String)
        })
        expect(body.comment).not.toHaveProperty('unnecessaryProperty')
        })
    })
})

describe('PATCH /api/articles/:article_id', () => {
    test('Status code 200 returned', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 1 })
        .expect(200)
        })

    test('Patch responds with an object that has the correct properties', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 5 })
        .then(({ body }) => {
        expect(body.article).toBeInstanceOf(Object)
        expect(body.article).toMatchObject({
            article_id: 1,
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String)
        })
    })
    })

    test('Patch increases the votes of the article by the correct amount', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 5 })
        .then(({ body }) => {
            expect(body.article.votes).toBe(105)
          })
      })

    test('Patch decreases the votes of the article by the correct amount', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: -10 })
        .then(({ body }) => {
            expect(body.article.votes).toBe(90)
          })
      })

    test('Patch responds with 400 error for invalid article_id', () => {
        return request(app)
        .patch('/api/articles/not-a-valid-id')
        .send({ inc_votes: 1 })
        .expect(400)
    })

    test('Patch responds with a 404 error for non-existent article_id', () => {
    return request(app)
        .patch('/api/articles/999')
        .send({ inc_votes: 1 })
        .expect(404)
    })
    
    test('Patch responds with a 400 error for invalid vote change', () => {
    return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 'not-a-number' })
        .expect(400)
    })

    test('Patch responds with a status code 200 and the correct properties when passed unnecessary properties', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({
            inc_votes: 5,
            unnecessaryProperty: "This property is unnecessary"
        })
        .expect(200)
        .then(({ body }) => {
        expect(body.article).not.toHaveProperty('unnecessaryProperty')
        })
    })
})

describe('Delete /api/comments/:comment_id', () => {
    test('Delete returns status code 204', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
    })

    test('Delete return an empty object', () => {
        return request(app)
        .delete('/api/comments/1')
        .then(({ body }) => {
        expect(body).toEqual({})
        })
    })

    test('Delete definitely deletes a comment', async () => {
        const { body } = 
        await request(app)
        .post('/api/articles/1/comments')
        .send({ username: 'butter_bridge', body: 'test comment' })
    
        await request(app)
        .delete(`/api/comments/${body.comment.comment_id}`)
        .expect(204)
    
        await request(app)
        .get(`/api/comments/${body.comment.comment_id}`)
        .expect(404)
    })

    test('Delete returns status 404 for non-existing comment_id', () => {
        return request(app)
        .delete('/api/comments/9999')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Not Found')
        })
    })

    test('Delete returns status 400 for invalid comment_id', () => {
        return request(app)
        .delete('/api/comments/notAnId')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad request')
        })
    })
})

describe('GET /api/users', () => {
    test('Status code 200 returned', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
    })

    test('Request responds with users that have the correct properties and length', () => {
        return request(app)
        .get('/api/users')
        .then(({ body }) => {
            expect(body.users).toHaveLength(4)
            body.users.forEach(user => {
            expect(user).toMatchObject({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String)
              })
            })
        })
    })
})

describe('GET /api/articles(queries)', () => {
    test('Status code 200 returned', () => {
        return request(app)
        .get('/api/articles?sort_by=votes')
        .expect(200)
        })

    test('Request responds with articles that have the correct properties and a comment_count', () => {
        return request(app)
        .get('/api/articles?sort_by=votes')
        .then(({ body }) => {
            expect(body.articles).toHaveLength(13)
            body.articles.forEach(article => {
            expect(article).toMatchObject({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number)
                })
            })
        })
    })

    test('Request responds with articles sorted by a valid column', () => {
        return request(app)
            .get('/api/articles?sort_by=votes')
            .then(({ body }) => {
            expect(body.articles).toBeSortedBy('votes', { descending: true })
            })
        })

    test('Request responds with articles sorted in ascending order', () => {
        return request(app)
            .get('/api/articles?order=asc')
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy('created_at')
            })
        })

    test('Request responds with articles filtered by topic', () => {
        return request(app)
            .get('/api/articles?topic=mitch')
            .then(({ body }) => {
            expect(body.articles).toHaveLength(12)
            body.articles.forEach(article => {
                expect(article.topic).toBe("mitch")
            })
        })
    })

    test('Request responds with status 400 for an invalid sort request', () => {
        return request(app)
            .get('/api/articles?sort_by=notAColumn')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request')
            })
    })

    test('Request responds with status 400 for an invalid order request', () => {
        return request(app)
            .get('/api/articles?order=notAnOrder')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request')
            })
    })

    test('Request responds with status 404 for non-existent topic', () => {
        return request(app)
            .get('/api/articles?topic=notATopic')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Not Found')
             })
    }) 
})