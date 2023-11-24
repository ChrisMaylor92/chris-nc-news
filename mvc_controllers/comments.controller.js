
const {insertComment, selectCommentsByArticleId, modelDeleteComment, updateComment, checkCommentExists} = require('../mvc_models/comments.model')
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
    const {query} = req
    const id = req.params.article_id
    const promises = [selectCommentsByArticleId(id, query), checkArticleExists(id)]
    Promise.all(promises)
    .then((resolvedPromises) => {
        const comments = resolvedPromises[0].rows
        res.status(200).send({comments})
    })
    .catch(next)

}

exports.deleteComment = (req, res, next) => {
    const id = req.params.comment_id
    modelDeleteComment(id)
    .then(() => {
        res.status(204).send()
    })
    .catch(next)
}

exports.patchCommentById = (req, res, next) => {
    console.log('smeloooo')
    updateComment()
}
exports.patchCommentById = (req, res, next) => {
    const id = req.params.comment_id
    const newVotes = req.body.inc_votes
    const promises = [updateComment(id, newVotes), checkCommentExists(id)]
    Promise.all(promises)
    .then((resolvedPromises) => {
        const updatedComment = resolvedPromises[0]
        res.status(200).send({updatedComment})
    })
    .catch(next)
}