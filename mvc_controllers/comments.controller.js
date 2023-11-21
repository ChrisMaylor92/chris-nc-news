const {insertComment} = require('../mvc_models/comments.model')

exports.postComment = () => {
    insertComment()
   
}