
const {selectCommentsByArticleId} = require('../mvc_models/comments.model')
const {checkArticleExists} = require('../mvc_models/articles.model')

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