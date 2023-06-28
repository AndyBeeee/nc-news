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
