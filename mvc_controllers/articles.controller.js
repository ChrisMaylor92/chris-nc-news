const {selectArticles} = require('../mvc_models/articles.model')
const {selectArticleById} = require('../mvc_models/articles.model')

exports.getArticles = (req, res, next) => {
    selectArticles()
    .then((articles) => {
        res.status(200).send({articles: articles.rows})
    })
}

exports.getArticleById = (req, res, next) => {
    selectArticleById(req.params.article_id)
    .then(({rows}) => {
        res.status(200).send({article: rows[0]})
    })
    .catch(next)
}

