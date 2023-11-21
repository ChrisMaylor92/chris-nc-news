const {selectArticleById} = require('../mvc_models/articles.model')

exports.getArticleById = (req, res, next) => {
    selectArticleById(req.params.article_id)
    .then(({rows}) => {
        res.status(200).send({article: rows[0]})
    })
    .catch(next)
}