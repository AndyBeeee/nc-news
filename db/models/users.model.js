const db = require('../connection')

exports.selectUsers = () => {
    return db.query (
        `SELECT * FROM users;`)
        .then(({ rows }) => {
            if(!rows.length) {
            return Promise.reject({ status: 404, msg: "Not Found" })
            } 
            return rows
    })
}