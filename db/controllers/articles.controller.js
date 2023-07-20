const { selectArticleById, selectAllComments, selectAllArticles, selectCommentsByArticleId, postComment, changeVotes, removeComment } = require("../models/articles.model")


exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    selectArticleById(article_id)
        .then((article) => {
        res.status(200).send({ article })
        })
        .catch(next)
}

exports.getAllArticles = (req, res, next) => {
    const { topic, sort_by, order } = req.query
  
    Promise.all([selectAllArticles(topic, sort_by, order), selectAllComments()])
      .then(([articles, comments]) => {
        for (let i = 0; i < articles.length; i++) {
          let comment_count = 0
          for (let a = 0; a < comments.length; a++) {
            if (comments[a].article_id === articles[i].article_id) {
              comment_count++
            }
          }
          articles[i].comment_count = comment_count;
        }
        res.status(200).send({ articles })
      })
      .catch(next)
  }

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params
    selectCommentsByArticleId(article_id)
        .then((comments) => {
        res.status(200).send({ comments })
        })
        .catch(next)
}

exports.postCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params
    const { username, body } = req.body
    selectArticleById(article_id)
    .then(article => {
        if (!article) {
            throw { status: 404, msg: 'Not Found' }
        } else {
            return postComment(article_id, username, body)
        }
    })
    .then((comment) => {
        res.status(201).send({ comment })
    })
    .catch(next)
}

exports.patchVotes = (req, res, next) => {
    const { article_id } = req.params
    const { inc_votes } = req.body
    changeVotes(article_id, inc_votes)
    .then((article) => {
        res.status(200).send({ article })
      })
    .catch(next)
}

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params
    removeComment(comment_id)
        .then(() => {
            res.status(204).send()
        })
        .catch(next)
}