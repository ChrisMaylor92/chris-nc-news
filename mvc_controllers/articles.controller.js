const {selectArticles} = require('../mvc_models/articles.model')
const {selectArticleById} = require('../mvc_models/articles.model')
const {checkTopicExists} = require('../mvc_models/topics.model')

exports.getArticles = (req, res, next) => {
    const {query} = req
    const queryKeys = Object.keys(query)
    if(queryKeys.length > 0){
        checkTopicExists(query.topic)
        .then(() => {
            return selectArticles(query)
        })
        .then((articles) => {
            res.status(200).send({articles})
        })
        .catch(next)
    } else {
    selectArticles(query)
    .then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next)
}
}

exports.getArticleById = (req, res, next) => {
    selectArticleById(req.params.article_id)
    .then(({rows}) => {
        res.status(200).send({article: rows[0]})
    })
    .catch(next)
}

