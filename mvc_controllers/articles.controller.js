const {checkTopicExists} = require('../mvc_models/topics.model')
const {selectArticleById, selectArticles, updateArticle, checkArticleExists} = require('../mvc_models/articles.model')


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

        res.status(200).send({articles: articles.rows})

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
