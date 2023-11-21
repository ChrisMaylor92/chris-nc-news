const {insertComment} = require('../mvc_models/comments.model')

exports.postComment = (req, res, next) => {
    const newComment = req.body
    const id = req.params.article_id
    //const promises = [insertComment({newComment, id })]
    insertComment({newComment, id })
    .then((newComment) => {
        console.log(newComment)
        res.status(201).send({newComment})
    })
    .catch(next)
   
}