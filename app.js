const express = require("express");
const {getTopics} = require('./mvc_controllers/topics.controller')
const app = express()


app.get('/api/topics', getTopics)

app.use((err, req, res, next) => {
    console.log(err)
})
module.exports = app

