const {deleteComment, patchCommentById} = require('../mvc_controllers/comments.controller')
const commentsRouter = require('express').Router();

commentsRouter.delete('/:comment_id', deleteComment)
commentsRouter.patch('/:comment_id', patchCommentById)

module.exports = commentsRouter;