const db = require("../db/connection");

// exports.insertComment = () => {
//     return db.query()
//     console.log('hello from the othersiiiiide')
// }

exports.insertComment = ({newComment, id}) => {
    return db.query(
      `INSERT INTO comments (author, body, article_id)
      VALUES ($1, $2, $3) RETURNING *;`,
      [newComment.username, newComment.body, id]
    )
    .then((result) => {
      return result.rows[[0]]
    })
  }