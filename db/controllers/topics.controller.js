const db = require("../connection.js")
const { selectTopics } = require('../models/topics.model.js')

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topics) => {
        res.status(200).send({ topics })
    })
    .catch(next)
}