const {insertComment} = require('../mvc_models/comments.model')
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