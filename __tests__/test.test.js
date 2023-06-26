const request = require('supertest')
const app = require('../db/app')
const seed = require('../db/seeds/seed')
const data = require("../db/data/test-data/index")
const db = require("../db/connection.js")


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
