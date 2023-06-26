const db = require("../connection.js")

exports.selectTopics = () => {
    return db.query (
        `SELECT slug, description 
        FROM topics;`
    )
    .then (({ rows }) => {
        return rows
    })
}