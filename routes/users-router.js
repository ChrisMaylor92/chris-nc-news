const {getUsers} = require('../mvc_controllers/users.controller')
const usersRouter = require('express').Router();

usersRouter.get("/", getUsers)

module.exports = usersRouter;