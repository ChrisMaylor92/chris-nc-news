const {selectUsers} = require('../mvc_models/users.model')

exports.getUsers = (req, res, next) => {
    selectUsers()
    .then((result) => {
        res.status(200).send({users: result.rows})
    })
}