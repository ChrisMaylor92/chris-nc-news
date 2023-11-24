const {checkTopicExists} = require('../mvc_models/topics.model')
const {selectArticleById, selectArticles, updateArticle, checkArticleExists, insertArticle, modelDeleteArticle} = require('../mvc_models/articles.model')


exports.getArticles = (req, res, next) => {
    const {query} = req
    const queryKeys = Object.keys(query)
    if(queryKeys.length > 0 && queryKeys[0] === 'sort_by') {
        selectArticles(query)
        .then((articles) => {
            res.status(200).send({articles})
        })
        .catch(next)
    }
    if(queryKeys.length > 0 && queryKeys[0] === 'limit'){
        selectArticles(query)
        .then((articles) => {
            const count = articles.length
            res.status(200).send({articles: articles, total_count: count})
        })
        .catch(next)
    }

    if(queryKeys.length > 0 && queryKeys[0] === 'topic'){
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


exports.postArticle = (req, res, next) => {
    
    const newArticle = req.body
    insertArticle(newArticle)
    .then((newArticle) => {
        res.status(201).send({newArticle})
    })
    .catch(next)
}

exports.deleteArticle = (req, res, next) => {
    const id = req.params.article_id
    modelDeleteArticle(id)
    .then(() => {
        res.status(204).send()
    })
    .catch(next)
}