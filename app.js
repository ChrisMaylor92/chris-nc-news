const express = require("express");
const {getTopics} = require('./mvc_controllers/topics.controller')
const {getArticles} = require('./mvc_controllers/articles.controller')
const app = express()


app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)





module.exports = app

