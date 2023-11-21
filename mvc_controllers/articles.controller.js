
const {selectArticleById, selectArticles, updateArticle} = require('../mvc_models/articles.model')

exports.getArticles = (req, res, next) => {
    selectArticles()
    .then((articles) => {
        console.log(articles.rows)
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

exports.patchArticleById = (req, res, next) => {
    const id = req.params.article_id
    const newVotes = req.body.inc_votes
    updateArticle(id, newVotes)
    .then((updatedArticle) => {
        res.status(200).send({updatedArticle})
    })
   
}