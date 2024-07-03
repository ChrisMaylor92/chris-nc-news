const db = require("../db/connection");


exports.selectArticles = (query) => {
    //PROBLEM 
    //follow queryString protocol throughout
    // if passing all tests, follow TDD from here 
    //'all valid sort_by instances' needs all valid topic, limit and p queries added 
    //'all valid order instances without sort_by' needs all valid topic, limit and p queries added
    //'all valid topic instances without sort_by and order' needs all valid limit and p queries added
    //'all valid limit instances without sort_by, order and topic' needs all valid p queries added
    //'all valid p instances without sort_by, order, topic and limit' 

   
    
    let queryString = `
    SELECT articles.title, articles.topic, articles.author, articles.created_at, articles.article_id, articles.article_img_url, 
    COUNT (comment_id) AS comment_count 
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id `
    
    const greenListSortBy = ['title', 'topic', 'author', 'created_at', 'article_id', 'article_img_url']
    const greenListOrder = ['asc', 'desc']
    
    //ERROR HANDLING
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
    
     //error handlers to check for letters, need moving these to the top
     if(query.limit){
        const capitalLimit = query.limit.toUpperCase()
        if (capitalLimit !== query.limit) {
           
            return Promise.reject({status:400, msg: 'Bad request.'})
        }
    }
    //same again
    if(query.p){
        const capitalP = query.p.toUpperCase()
        if (capitalP !== query.p) {
            return Promise.reject({status:400, msg: 'Bad request.'})
        }
    }
    //error handling any requests that arent on the greenlist for order and sort_by
    if (queryKeys[0] === 'sort_by' && !greenListSortBy.includes(query.sort_by)){
        return Promise.reject({status:400, msg: 'Bad request.'})
    }
    if (queryKeys[1] === 'order' && !greenListOrder.includes(query.order)){
        return Promise.reject({status:400, msg: 'Bad request.'})
    }
    if (queryKeys[0] === 'order' && !greenListOrder.includes(query.order)){
        return Promise.reject({status:400, msg: 'Bad request.'})
    }


    //ALL VALID sort_by INSTANCES
    if(greenListSortBy.includes(query.sort_by)){
        //article id instances
        //need to add if p and limit are undefined to the exisiting instances and then add the same instances again but where p and limit are defined 
        if(query.sort_by === 'article_id' && query.order === undefined){
            queryString += `GROUP BY articles.article_id
            ORDER BY article_id DESC`
        }

        if (greenListOrder.includes(query.order)){
            if(query.sort_by === 'article_id' && query.order === 'desc'){
                queryString += `GROUP BY articles.article_id
                ORDER BY article_id DESC`
            }
            if(query.sort_by === 'article_id' && query.order === 'asc'){
                queryString += `GROUP BY articles.article_id
                ORDER BY article_id ASC`
            }
        }
        //all title instances
        if(query.sort_by === 'title' && query.order === undefined){
            queryString += `GROUP BY articles.article_id
            ORDER BY title DESC`
        }

        if (greenListOrder.includes(query.order)){
            if(query.sort_by === 'title' && query.order === 'desc'){
                queryString += `GROUP BY articles.article_id
                ORDER BY title DESC`
            }
            if(query.sort_by === 'title' && query.order === 'asc'){
                queryString += `GROUP BY articles.article_id
                ORDER BY title ASC`
            }
        }
        //all topic instances
        if(query.sort_by === 'topic' && query.order === undefined){
            queryString += `GROUP BY articles.article_id
            ORDER BY topic DESC`
        }

        if (greenListOrder.includes(query.order)){
            if(query.sort_by === 'topic' && query.order === 'desc'){
                queryString += `GROUP BY articles.article_id
                ORDER BY topic DESC`
            }
            if(query.sort_by === 'topic' && query.order === 'asc'){
                queryString += `GROUP BY articles.article_id
                ORDER BY topic ASC`
            }
        }
        //all author instances
        if(query.sort_by === 'author' && query.order === undefined){
            queryString += `GROUP BY articles.article_id
            ORDER BY author DESC`
        }

        if (greenListOrder.includes(query.order)){
            if(query.sort_by === 'author' && query.order === 'desc'){
                queryString += `GROUP BY articles.article_id
                ORDER BY author DESC`
            }
            if(query.sort_by === 'author' && query.order === 'asc'){
                queryString += `GROUP BY articles.article_id
                ORDER BY author ASC`
            }
        }
        //all created_at instances
        if(query.sort_by === 'created_at' && query.order === undefined){
            queryString += `GROUP BY articles.article_id
            ORDER BY created_at DESC`
        }

        if (greenListOrder.includes(query.order)){
            if(query.sort_by === 'created_at' && query.order === 'desc'){
                queryString += `GROUP BY articles.article_id
                ORDER BY created_at DESC`
            }
            if(query.sort_by === 'created_at' && query.order === 'asc'){
                queryString += `GROUP BY articles.article_id
                ORDER BY created_at ASC`
            }
        }
        //all article_img_url instances
        if(query.sort_by === 'article_img_url' && query.order === undefined){
            queryString += `GROUP BY articles.article_id
            ORDER BY article_img_url DESC`
        }

        if (greenListOrder.includes(query.order)){
            if(query.sort_by === 'article_img_url' && query.order === 'desc'){
                queryString += `GROUP BY articles.article_id
                ORDER BY article_img_url DESC`
            }
            if(query.sort_by === 'article_img_url' && query.order === 'asc'){
                queryString += `GROUP BY articles.article_id
                ORDER BY article_img_url ASC`
            }
        }
        
    }
    // ALL VALID order INSTANCES WITHOUT sort_by
    if(queryKeys[0] === 'order' && greenListOrder.includes(query.order)){
        if(query.order === 'asc'){
            queryString += `GROUP BY articles.article_id
            ORDER BY created_at ASC`
        }
        if(query.order === 'desc'){
            queryString += `GROUP BY articles.article_id
            ORDER BY created_at DESC`
        }
    }
    
    // handles topic= requests but not topic plus sort by, order p and limit 
    //if only topic returns only the articles in this topic, need to paginate, need to remove return statement and add SQL queery to queery string follow same protocol 
    if(query.topic){
        return db.query(`
        SELECT articles.title, articles.topic, articles.author, articles.created_at, articles.article_id, articles.article_img_url, 
        COUNT (comment_id) AS comment_count 
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        WHERE topic = $1
        GROUP BY articles.article_id
        ORDER BY created_at DESC;`, [query.topic])
        .then((result) => {
            return result.rows
        }) 
    } 
   
    //defaults to first page of 10 when only ?limit is queried, need to remove return statement and follow protocol 
    if (query.limit === '' && !query.p) {
        return db.query(`
            SELECT articles.title, articles.topic, articles.author, articles.created_at, articles.article_id, articles.article_img_url, 
            COUNT (comment_id) AS comment_count 
            FROM articles
            LEFT JOIN comments
            ON articles.article_id = comments.article_id
            GROUP BY articles.article_id
            ORDER BY created_at DESC
            LIMIT 10;`)
            .then((result) => {
                return result.rows
            }) 
    }
    //defaults to 10 per page and picks the correct page, need to add querie of just p=* this currently throws a server error, need to do tests as well, not sure if this is 100% neccesary if you explain that all p queries need limit in the endpoints json, still need to remove return and foloow protocol 
    if (query.limit === '' && query.p) {
        const offsetAmount = query.p - 1
        const offset = 10 * offsetAmount
        return db.query(`
            SELECT articles.title, articles.topic, articles.author, articles.created_at, articles.article_id, articles.article_img_url, 
            COUNT (comment_id) AS comment_count 
            FROM articles
            LEFT JOIN comments
            ON articles.article_id = comments.article_id
            GROUP BY articles.article_id
            ORDER BY created_at DESC
            LIMIT 10
            OFFSET $1;`, [offset])
            .then((result) => {
                return result.rows
            }) 
    }
    //previous conditions will make sure that limit is always a number at this point, need to remove return and follow protocol 
    if (query.limit && !query.p) {
        return db.query(`
            SELECT articles.title, articles.topic, articles.author, articles.created_at, articles.article_id, articles.article_img_url, 
            COUNT (comment_id) AS comment_count 
            FROM articles
            LEFT JOIN comments
            ON articles.article_id = comments.article_id
            GROUP BY articles.article_id
            ORDER BY created_at DESC
            LIMIT $1;`, [query.limit])
            .then((result) => {
                return result.rows
            }) 
    }
    if(query.limit && query.p === '1'){
        return db.query(`
            SELECT articles.title, articles.topic, articles.author, articles.created_at, articles.article_id, articles.article_img_url, 
            COUNT (comment_id) AS comment_count 
            FROM articles
            LEFT JOIN comments
            ON articles.article_id = comments.article_id
            GROUP BY articles.article_id
            ORDER BY created_at DESC
            LIMIT $1;`, [query.limit])
            .then((result) => {
                return result.rows
            }) 
    }
    if(query.limit && query.p ){
        const offsetAmount = query.p - 1
        const offset = query.limit * offsetAmount
        return db.query(`
            SELECT articles.title, articles.topic, articles.author, articles.created_at, articles.article_id, articles.article_img_url, 
            COUNT (comment_id) AS comment_count 
            FROM articles
            LEFT JOIN comments
            ON articles.article_id = comments.article_id
            GROUP BY articles.article_id
            ORDER BY created_at DESC
            LIMIT $1
            OFFSET $2;`, [query.limit, offset])
            .then((result) => {
                return result.rows
            }) 
    }


    //could potentially remove all ; characters from query string add ons and add it here before returning it
    return db.query(queryString + ';')
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