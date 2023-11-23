const {selectUsers, selectUsersByUsername} = require('../mvc_models/users.model')

exports.getUsers = (req, res, next) => {
    selectUsers()
    .then((result) => {
        res.status(200).send({users: result.rows})
    })
}
exports.getUsersByUsername = (req, res, next) => {
    const username = req.params.username
    selectUsersByUsername(username)
    .then((user) => {
        res.status(200).send({user})
    })
    .catch(next)
}