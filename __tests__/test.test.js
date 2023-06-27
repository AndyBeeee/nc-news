const request = require('supertest')
const app = require('../db/app')
const seed = require('../db/seeds/seed')
const data = require("../db/data/test-data/index")
const db = require("../db/connection.js")
const endpoints = require('../endpoints.json')


beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    return db.end()
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
        const articleFormat = {
        author: expect.any(String),
        title: expect.any(String),
        article_id: expect.any(Number),
        body: expect.any(String),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String)
        }
        const expected = expect.objectContaining(articleFormat)
        return request(app)
        .get('/api/articles/2')
        .then(({ body }) => {
            expect(body.article).toEqual(expected)
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
    test('Request responds with a 400 status for an invalid article_id', () => {
    return request(app)
        .get('/api/articles/notAnId')
        .expect(400)
        .then(({ body }) => {
        expect(body.msg).toEqual('Bad request')
        })
    })
    })

