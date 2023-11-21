
const {selectArticleById, selectArticles, updateArticle, checkArticleExists} = require('../mvc_models/articles.model')

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
    const promises = [updateArticle(id, newVotes), checkArticleExists(id)]
    Promise.all(promises)
    .then((resolvedPromises) => {
        const updatedArticle = resolvedPromises[0]
        res.status(200).send({updatedArticle})
    })
    .catch(next)
   
}
