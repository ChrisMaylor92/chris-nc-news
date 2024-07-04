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
        return db.query(`
        SELECT articles.title, articles.topic, articles.author, articles.created_at, articles.article_id, articles.article_img_url, 
        COUNT (comment_id) AS comment_count 
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY created_at DESC;`)
        .then((result) => {
            return result.rows
        })
    }   
    
     //ERROR HANDLING
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
    
            let sortBy 
            if (!query.sort_by) {
                sortBy = 'created_at'
            }
            else {
                sortBy = query.sort_by
            }
            let order 
            if (!query.order) {
                order = 'desc'
            }
            else {
                order = query.order
            }
            let limit 
            if (query.limit) {
                limit = query.limit
            }
            if (query.limit === ''){
                limit = 10
            }
            
                    if (!query.limit) {
                        
                        if (!query.p) {
                            if (!query.topic){
                                return db.query(queryString + `
                                
                                GROUP BY articles.article_id
                                ORDER BY ${sortBy} ${order} 
                                ${query.limit === "" ? `LIMIT 10` : ``};`)
                                .then((result) => {
                                    return result.rows
                                }) 
                            }
                            if (query.topic){
                                return db.query(queryString + `
                                WHERE topic = $1
                                GROUP BY articles.article_id
                                ORDER BY ${sortBy} ${order}
                                ${query.limit === "" ? `LIMIT 10` : ``};`, [query.topic])
                                .then((result) => {
                                    return result.rows
                                }) 
                            }
                            
                        }
                    }
                    
                    if (query.limit ) {
                        
                        if (!query.p || query.p === '1') {
                            
                            if (!query.topic){
                                return db.query(queryString + `
                                GROUP BY articles.article_id
                                ORDER BY ${sortBy} ${order}
                                LIMIT $1;`, [limit])
                                .then((result) => {
                                    return result.rows
                                }) 
                            }
                            if (query.topic){
                                return db.query(queryString + `
                                WHERE topic = $1
                                GROUP BY articles.article_id
                                ORDER BY ${sortBy} ${order}
                                LIMIT $2;`, [query.topic, limit])
                                .then((result) => {
                                    return result.rows
                                }) 
                            }
                        }
                        if (query.p) {
                            
                            const offsetAmount = query.p - 1
                            const offset = query.limit * offsetAmount
                            if (!query.topic){
                                return db.query(queryString + `
                                GROUP BY articles.article_id
                                ORDER BY ${sortBy} ${order}
                                LIMIT $1
                                OFFSET $2;`, [limit, offset])
                                .then((result) => {
                                    return result.rows
                                }) 
                            }
                            if (query.topic){
                                return db.query(queryString + `
                                WHERE topic = $1
                                GROUP BY articles.article_id
                                ORDER BY ${sortBy} ${order}
                                LIMIT $2
                                OFFSET $3;`, [query.topic, limit, offset])
                                .then((result) => {
                                    return result.rows
                                }) 
                            }
                        }
                    }
                  
        
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