
const {selectCommentsByArticleId} = require('../mvc_models/comments.model')
exports.getCommentsByArticleId = (req, res, next) => {
    const id = req.params.article_id
    selectCommentsByArticleId(id)
    .then(({rows}) => {
        res.status(200).send({comments: rows})
    })
    .catch(next)
}