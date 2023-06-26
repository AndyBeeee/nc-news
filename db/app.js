const express = require('express')
const app = express()

const { getTopics } = require('./controllers/topics.controller.js')

app.use(express.json())

app.get('/api/topics', getTopics)

app.use((err, req, res, next) => {
    if (err.code) {
      res.status(400).send({ msg: 'Bad request' })
    } else if (err.status) {
      res.status(err.status).send({ msg: err.msg })
    } else {
      res.status(500).send({ msg: 'Internal server error' })
    }
  })

app.listen(9090, () => {
    console.log('listening on port 9090')
})

module.exports = app