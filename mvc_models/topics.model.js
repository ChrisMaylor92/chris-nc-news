const db = require("../db/connection");

exports.selectTopics = (req, res) => {
    return db.query(
        `SELECT * FROM topics;`
    )
}
exports.checkTopicExists = (topic) => {
    return db.query(`
        SELECT * FROM topics WHERE slug = $1;`, [topic])
        .then((result) =>{
            if(result.rows.length === 0){
                return Promise.reject({status:404, msg: 'Topic does not exist.'})
            }
            return result
        })
}