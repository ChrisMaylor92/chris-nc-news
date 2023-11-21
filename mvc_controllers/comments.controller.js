
const {insertComment, selectCommentsByArticleId} = require('../mvc_models/comments.model')
const {checkArticleExists} = require('../mvc_models/articles.model')


exports.postComment = (req, res, next) => {
    const newComment = req.body
    const id = req.params.article_id
    checkArticleExists(id)
    .then(() => {
        return insertComment({newComment, id })
    })
    .then((newComment) => {
        res.status(201).send({newComment})
    })
    .catch(next)
}



exports.getCommentsByArticleId = (req, res, next) => {
    const id = req.params.article_id
    const promises = [selectCommentsByArticleId(id), checkArticleExists(id)]
    Promise.all(promises)
    .then((resolvedPromises) => {
        const comments = resolvedPromises[0].rows
        res.status(200).send({comments})
    })
    .catch(next)

}