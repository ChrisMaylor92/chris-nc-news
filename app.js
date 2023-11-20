const express = require("express");
const {getTopics} = require('./mvc_controllers/topics.controller')
const app = express()


app.get('/api/topics', getTopics)


module.exports = app

