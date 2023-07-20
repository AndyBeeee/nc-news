const db = require('../connection')

exports.selectArticleById = (article_id) => {
    return db.query (
        `SELECT * FROM articles 
        WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
            if(!rows.length) {
            return Promise.reject({ status: 404, msg: "Not Found" })
            } 
            return rows[0]
    })
}

exports.selectAllComments = () => {
    return db.query (
        `SELECT * FROM comments;`)
        .then(({ rows }) => {
            if(!rows.length) {
            return Promise.reject({ status: 404, msg: "Not Found" })
            } 
            return rows
    })
}

exports.selectAllArticles = (topic, sort_by = 'created_at', order = 'desc') => {
    let query = `SELECT a.author, a.title, a.body, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id) AS comment_count
                 FROM articles a LEFT JOIN comments c ON a.article_id = c.article_id
                 GROUP BY a.article_id
                 ORDER BY ${sort_by === 'comment_count' ? 'COUNT(c.comment_id)' : 'a.' + sort_by} ${order}`;
  
    if (topic) {
      query = `SELECT a.author, a.title, a.body, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id) AS comment_count
               FROM articles a LEFT JOIN comments c ON a.article_id = c.article_id
               WHERE a.topic = $1
               GROUP BY a.article_id
               ORDER BY ${sort_by === 'comment_count' ? 'COUNT(c.comment_id)' : 'a.' + sort_by} ${order}`;
      return db.query(query, [topic])
        .then(({ rows }) => {
          if(!rows.length) {
            return Promise.reject({ status: 404, msg: "Not Found" })
          } 
          return rows
        })
    }
  
    return db.query(query)
      .then(({ rows }) => {
        if(!rows.length) {
          return Promise.reject({ status: 404, msg: "Not Found" })
        } 
        return rows
      })
  }

exports.selectCommentsByArticleId = (article_id) => {
    return db.query (
        `SELECT * 
        FROM articles 
        WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
            if(!rows.length) {
                return Promise.reject({ status: 404, msg: "Not Found" })
            } 
    return db.query (
        `SELECT comment_id, votes, created_at, author, body, article_id 
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;`, [article_id])
        .then(({ rows }) => {
            return rows
        })
    })
}

exports.postComment = (article_id, username, body) => {
    return db.query (
        `INSERT INTO comments (body, article_id, author)
        VALUES ($1, $2, $3)
        RETURNING *;`, [body, article_id, username])
        .then(({ rows }) => {
            return rows[0]
    })
}

exports.changeVotes = (article_id, inc_votes) => {
    return db.query(
      `UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
        if (!rows.length) {
          return Promise.reject({ status: 404, msg: 'Not Found' })
        }
        return rows[0]
      })
  }

  exports.removeComment = (comment_id) => {
    return db.query(
        `DELETE FROM comments 
        WHERE comment_id = $1 
        RETURNING *;`, 
        [comment_id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: "Not Found" })
            } 
        })
}