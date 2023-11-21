const db = require("../db/connection");


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

exports.selectCommentsByArticleId = (id) => {
    return db.query(`
    SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [id])
} 

