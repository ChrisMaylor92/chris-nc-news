const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require('./errors')
const express = require("express");
const app = express()
const cors = require('cors')
app.use(cors())
const apiRouter = require('./routers/api-router');
const topicsRouter = require('./routers/topics-router');
const usersRouter = require('./routers/users-router');
const commentsRouter = require('./routers/comments-router');
const articlesRouter = require('./routers/articles-router')


app.use(express.json());



app.use('/api', apiRouter);
app.use('/api/topics', topicsRouter);
app.use("/api/users", usersRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/articles', articlesRouter)

app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)





module.exports = app

