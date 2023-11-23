const {deleteComment} = require('../mvc_controllers/comments.controller')
const commentsRouter = require('express').Router();

commentsRouter.delete('/:comment_id', deleteComment)

module.exports = commentsRouter;