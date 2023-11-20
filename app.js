const express = require("express");
const {getTopics} = require('./mvc_controllers/topics.controller')
const {getEndpoints} = require('./mvc_controllers/api.controller')
const app = express()


app.get('/api/topics', getTopics)
app.get('/api', getEndpoints)

module.exports = app

