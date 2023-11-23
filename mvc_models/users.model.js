const db = require("../db/connection");

exports.selectUsers = () => {
    return db.query(`
    SELECT * FROM users;`)
}

exports.selectUsersByUsername = (username) => {
    return db.query(`
    SELECT * FROM users WHERE username = $1;`, [username])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({status:404, msg: 'User does not exist.'})
        }else{
            return result.rows[0]
        }
    })
}

