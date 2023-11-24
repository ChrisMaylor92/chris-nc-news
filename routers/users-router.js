const {getUsers, getUsersByUsername} = require('../mvc_controllers/users.controller')
const usersRouter = require('express').Router();

usersRouter.get("/", getUsers)//
usersRouter.get("/:username", getUsersByUsername)

module.exports = usersRouter;