const db = require("../db/connection");


exports.selectArticles = (query) => {
    let queryString = `
        SELECT articles.title, articles.topic, articles.author, articles.created_at, articles.article_id, articles.article_img_url, 
        COUNT (comment_id) AS comment_count 
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id `
    
    const greenListSortBy = ['title', 'topic', 'author', 'created_at', 'article_id', 'article_img_url']
    const greenListOrder = ['asc', 'desc']
    
    const queryKeys = Object.keys(query)

    if (queryKeys.length === 0) {
        return db.query(queryString + `
            GROUP BY articles.article_id
            ORDER BY created_at DESC;`
        )
        .then((result) => {
            return result.rows
        })
    }
     //ERROR HANDLING 
     // all return the same reject statement so could all fall under 1 if statement
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
    if (query.sort_by && !greenListSortBy.includes(query.sort_by)){
        return Promise.reject({status:400, msg: 'Bad request.'})
    }
    if (query.order && !greenListOrder.includes(query.order)){
        return Promise.reject({status:400, msg: 'Bad request.'})
    }
// CREATE UTIL FUNCTION called create query defaults, one function with all conditions below in it
    if (!query.sort_by) {
        query.sort_by = 'created_at'
    }
    if (!query.order) {
        query.order = 'desc'
    }
    if (query.limit === '' && !query.limit){
        query.limit = `10`
    }

    const offsetAmount = query.p - 1
    const offset = query.limit * offsetAmount
    return db.query(queryString + `
        ${query.topic ? `WHERE topic = $1` : ``}
        GROUP BY articles.article_id
        ORDER BY ${query.sort_by} ${query.order}
        ${ query.limit ? `LIMIT $${query.topic ? `2` : `1`}` : ``}
        ${query.p && query.limit && query.p !== '1' ? `OFFSET $` : ``}${query.topic && query.limit && query.p && query.p !== 1 ? `3` : ``}${!query.topic && query.limit && query.p && query.p !== '1' ? `2` : ``};`, 
            query.topic && query.limit && query.p && query.p !== '1' ? [query.topic, query.limit, offset] : 
            query.topic && query.limit ? [query.topic, query.limit] : 
            query.topic ? [query.topic] : 
            query.limit && !query.p || query.p === '1' ? [query.limit] : 
            query.limit && query.p && query.p !== '1' ? [query.limit, offset] : []
    )
    .then((result) => {
        return result.rows
    })      
}

exports.selectArticleById = (id) => {

        return db.query(`
        SELECT articles.*, 
        COUNT (comment_id) AS comment_count 
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id
        ORDER BY created_at DESC;`, [+id])
        .then((articles) =>{
       
            if(articles.rows.length === 0) {
                return Promise.reject({status:404, msg: 'Article does not exist.'})
            }else{
                return articles
            }
        })
}


exports.updateArticle = (id, newVotes) => {

    return db.query(
      `UPDATE articles
        SET votes = votes + $2
        WHERE article_id = $1 RETURNING *;`, [id, newVotes])
        .then((result) => {
            return result.rows[0]
        })
 }

exports.checkArticleExists = (id) => {
    
    return db.query(`
        SELECT * FROM articles WHERE article_id = $1;`, [id])
        .then((result) =>{
            if(result.rows.length === 0){
                return Promise.reject({status:404, msg: 'Article does not exist.'})
            }
        })
}

exports.insertArticle = (newArticle) => {

    return db.query(
      `INSERT INTO articles (title, topic, author, body)
      VALUES ($1, $2, $3, $4) RETURNING *;`,
      [newArticle.title, newArticle.topic, newArticle.author, newArticle.body]
    )
    .then((result) => {
      return result.rows[[0]]
    })
  }

  exports.modelDeleteArticle = (id) => {
   
    return db.query(
      `DELETE FROM articles
      WHERE article_id = $1 RETURNING *;`, [id])
    .then((result) =>{
      
      if(result.rows.length === 0){
          return Promise.reject({status:404, msg: 'Article does not exist.'})
      }
      else { 
          return result.rows[0]
      }
  })

}