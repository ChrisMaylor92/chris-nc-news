const {getEndpoints} = require('../mvc_controllers/api.controller')
const apiRouter = require('express').Router();

apiRouter.get('/', getEndpoints)

module.exports = apiRouter;