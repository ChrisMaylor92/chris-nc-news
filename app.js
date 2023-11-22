const express = require("express");
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require('./errors')
const {getTopics} = require('./mvc_controllers/topics.controller')
const {getArticles, getArticleById, patchArticleById} = require('./mvc_controllers/articles.controller')
const {getEndpoints} = require('./mvc_controllers/api.controller')
const {getUsers} = require('./mvc_controllers/users.controller')
const {getCommentsByArticleId, postComment, deleteComment} = require('./mvc_controllers/comments.controller')

const app = express()
app.use(express.json());



app.get('/api', getEndpoints)
app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById) 
app.post('/api/articles/:article_id/comments', postComment) 
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
app.get("/api/users", getUsers)
app.delete('/api/comments/:comment_id', deleteComment)
app.patch('/api/articles/:article_id', patchArticleById)


app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)





module.exports = app

