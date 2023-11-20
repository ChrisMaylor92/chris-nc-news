const express = require("express");
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require('./errors')
const {getTopics} = require('./mvc_controllers/topics.controller')
const {getArticleById} = require('./mvc_controllers/articles.controller')
const app = express()


app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id', getArticleById)



app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)


module.exports = app

