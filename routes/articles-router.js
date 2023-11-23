const {getCommentsByArticleId, postComment} = require('../mvc_controllers/comments.controller')
const {getArticles, getArticleById, patchArticleById} = require('../mvc_controllers/articles.controller')
const articlesRouter = require('express').Router();

articlesRouter.get('/', getArticles)
articlesRouter.get('/:article_id', getArticleById) 
articlesRouter.get('/:article_id/comments', getCommentsByArticleId)
articlesRouter.post('/:article_id/comments', postComment) 
articlesRouter.patch('/:article_id', patchArticleById)

module.exports = articlesRouter;