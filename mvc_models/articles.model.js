const db = require("../db/connection");

exports.selectArticleById = (id) => {
    return db.query(`SELECT article_id FROM articles;`)
    .then(({rows}) => {
      const greenlistedIds = rows.map((row) => {
        return row.article_id
      })
      console.log(greenlistedIds)
      const typeCheck = id.toUpperCase()
      if(id === typeCheck && !greenlistedIds.includes(+id)) {
        return Promise.reject({status:404, msg: 'Article does not exist.'})
      }
      else {
        return db.query(`
        SELECT * FROM articles WHERE article_id = $1;`, [id])
      }
    })
  
}