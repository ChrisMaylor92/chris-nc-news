const {selectArticles} = require('../mvc_models/articles.model')
const {selectCommentsById} = require('../mvc_models/comments.model')


exports.getArticles = (req, res, next) => {
    selectArticles()
    .then((articles) => {
        res.status(200).send({articles})
    })
    
}