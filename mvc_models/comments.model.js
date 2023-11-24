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

exports.selectCommentsByArticleId = (id, query) => {
  
  const queryKeys = Object.keys(query)
if(queryKeys.length > 0) {
  if(query.limit){
    const capitalLimit = query.limit.toUpperCase()
    if (capitalLimit !== query.limit) {
       
        return Promise.reject({status:400, msg: 'Bad request.'})
    }
  }
  if(query.p){
      const capitalP = query.p.toUpperCase()
      if (capitalP !== query.p) {
          return Promise.reject({status:400, msg: 'Bad request.'})
      }
  }

  if (query.limit === '' && !query.p) {
  
      return db.query(`
      SELECT * 
      FROM comments 
      WHERE article_id = $1 
      ORDER BY created_at DESC
      LIMIT 10;`, [id])
          .then((result) => {
            
              return result
          }) 
  }
  if (query.limit && !query.p) {
    return db.query(`
      SELECT * 
      FROM comments 
      WHERE article_id = $1 
      ORDER BY created_at DESC
      LIMIT $2;`, [id, query.limit])
        .then((result) => {
            return result
        }) 
}
  if (query.limit === '' && query.p) {
    const offsetAmount = query.p - 1
    const offset = 10 * offsetAmount
    return db.query(`
      SELECT * 
      FROM comments 
      WHERE article_id = $1 
      ORDER BY created_at DESC
      LIMIT 10
      OFFSET $2;`, [id, offset])
        .then((result) => {
            return result
        }) 
  }
  if(query.limit && query.p === '1'){
      return db.query(`
        SELECT * 
        FROM comments 
        WHERE article_id = $1 
        ORDER BY created_at DESC
        LIMIT $2;`, [id, query.limit])
      .then((result) => {
        return result
      }) 
  }
      
      
  if(query.limit && query.p ){
    const offsetAmount = query.p - 1
    const offset = query.limit * offsetAmount
    return db.query(`
        SELECT * 
        FROM comments 
        WHERE article_id = $1 
        ORDER BY created_at DESC
        LIMIT $2
        OFFSET $3;`, [id, query.limit, offset])
    .then((result) => {
      return result
    }) 
  }
} else {
  return db.query(`
      SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [id])
}
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