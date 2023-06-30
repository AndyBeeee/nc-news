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

exports.selectAllArticles = (topic, sort_by, order) => {
    
    if(!sort_by) {sort_by = 'created_at'}
    if(!order) {order = 'desc'}
    
    let query = `
        SELECT author, title, article_id, topic, created_at, votes, article_img_url,
        CAST ((SELECT COUNT(*) FROM comments 
        WHERE articles.article_id = comments.article_id) AS INTEGER)
        AS comment_count
        FROM articles`

    if (topic) {
        query += ` WHERE topic = '${topic}'`
    }

    query += ` ORDER BY ${sort_by} ${order}`

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