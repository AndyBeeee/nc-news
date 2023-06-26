const express = require('express')
const app = express()

const { getTopics } = require('./controllers/topics.controller.js')
const endpoints = require('../endpoints.json')


app.get('/api/topics', getTopics)

app.get('/api', (req, res) => {
    res.status(200).send(endpoints)
  })

app.use((err, req, res, next) => {
    if (err.code) {
      res.status(400).send({ msg: 'Bad request' })
    } else if (err.status) {
      res.status(err.status).send({ msg: err.msg })
    } else {
      res.status(500).send({ msg: 'Internal server error' })
    }
  })


module.exports = app