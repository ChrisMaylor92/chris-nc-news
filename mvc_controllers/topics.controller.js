const {selectTopics, insertTopic} = require('../mvc_models/topics.model')

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topics) => {
        res.status(200).send({topics: topics.rows})
    })

}


exports.postTopic = (req, res, next) => {
    const newTopic = req.body
    insertTopic(newTopic)
    .then((newTopic) => {
        res.status(201).send({newTopic})
    })
    .catch(next)
}