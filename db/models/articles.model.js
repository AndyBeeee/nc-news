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

exports.selectAllArticles = () => {
    return db.query (
        `SELECT author, title, article_id, topic, created_at, votes, article_img_url 
        FROM articles
        ORDER BY created_at DESC;`)
        .then(({ rows }) => {
            if(!rows.length) {
            return Promise.reject({ status: 404, msg: "Not Found" })
            } 
            return rows
    })
}