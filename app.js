const express = require("express");
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require('./errors')
const {getTopics} = require('./mvc_controllers/topics.controller')
const {getArticles, getArticleById} = require('./mvc_controllers/articles.controller')
const {getEndpoints} = require('./mvc_controllers/api.controller')
const {getCommentsByArticleId, postComment, deleteComment} = require('./mvc_controllers/comments.controller')
const app = express()
app.use(express.json());


app.get('/api', getEndpoints)

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)

app.post('/api/articles/:article_id/comments', postComment)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
app.delete('/api/comments/:comment_id', deleteComment)


app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)





module.exports = app

