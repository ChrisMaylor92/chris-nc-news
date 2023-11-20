const {selectTopics} = require('../mvc_models/topics.model')

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topics) => {
        res.status(200).send({topics: topics.rows})
    })

}