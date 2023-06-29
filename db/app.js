const express = require('express')
const app = express()

const { getTopics } = require('./controllers/topics.controller')
const endpoints = require('../endpoints.json')
const { getArticleById, getAllArticles, getCommentsByArticleId, postCommentByArticleId, patchVotes, deleteComment} = require('./controllers/articles.controller')

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api', (req, res) => {
    res.status(200).send(endpoints)
  })

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postCommentByArticleId)

app.patch('/api/articles/:article_id', patchVotes)

app.delete('/api/comments/:comment_id', deleteComment)

app.all('*', (_,res) => {
    res.status(404).send({status: 404, msg: "Not Found"})
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