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

exports.modelDeleteComment = (id) => {
  return db.query(
    `DELETE FROM comments
    WHERE comment_id = $1 RETURNING *;`, [id]
  )
  .then((result) =>{
    if(result.rows.length === 0){
        return Promise.reject({status:404, msg: 'Comment does not exist.'})
    }
    else { 
        return result.rows[0]
    }
})
}

exports.updateComment = (id, newVotes) => {

  return db.query(
    `UPDATE comments
      SET votes = votes + $2
      WHERE comment_id = $1 RETURNING *;`, [id, newVotes])
      .then((result) => {
          return result.rows[0]
      })
}

exports.checkCommentExists = (id) => {
    
  return db.query(`
      SELECT * FROM comments WHERE comment_id = $1;`, [id])
      .then((result) =>{
          if(result.rows.length === 0){
              return Promise.reject({status:404, msg: 'Comment does not exist.'})
          }
      })
}