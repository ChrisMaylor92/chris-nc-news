const db = require("../db/connection");


exports.selectArticles = (query) => {


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

    let queryString = `
    SELECT articles.title, articles.topic, articles.author, articles.created_at, articles.article_id, articles.article_img_url, 
    COUNT (comment_id) AS comment_count 
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id `
    
    const greenListSortBy = ['title', 'topic', 'author', 'created_at', 'article_id', 'article_img_url']
    const greenListOrder = ['asc', 'desc']

    if(greenListSortBy.includes(query.sort_by)){
        //all article id instances
        if(query.sort_by === 'article_id' && query.order === undefined){
            queryString += `GROUP BY articles.article_id
            ORDER BY article_id DESC;`
        }

        if (greenListOrder.includes(query.order)){
            if(query.sort_by === 'article_id' && query.order === 'desc'){
                queryString += `GROUP BY articles.article_id
                ORDER BY article_id DESC;`
            }
            if(query.sort_by === 'article_id' && query.order === 'asc'){
                queryString += `GROUP BY articles.article_id
                ORDER BY article_id ASC;`
            }
        }
        //all title instances
        if(query.sort_by === 'title' && query.order === undefined){
            queryString += `GROUP BY articles.article_id
            ORDER BY title DESC;`
        }

        if (greenListOrder.includes(query.order)){
            if(query.sort_by === 'title' && query.order === 'desc'){
                queryString += `GROUP BY articles.article_id
                ORDER BY title DESC;`
            }
            if(query.sort_by === 'title' && query.order === 'asc'){
                queryString += `GROUP BY articles.article_id
                ORDER BY title ASC;`
            }
        }
        //all topic instances
        if(query.sort_by === 'topic' && query.order === undefined){
            queryString += `GROUP BY articles.article_id
            ORDER BY topic DESC;`
        }

        if (greenListOrder.includes(query.order)){
            if(query.sort_by === 'topic' && query.order === 'desc'){
                queryString += `GROUP BY articles.article_id
                ORDER BY topic DESC;`
            }
            if(query.sort_by === 'topic' && query.order === 'asc'){
                queryString += `GROUP BY articles.article_id
                ORDER BY topic ASC;`
            }
        }
        //all author instances
        if(query.sort_by === 'author' && query.order === undefined){
            queryString += `GROUP BY articles.article_id
            ORDER BY author DESC;`
        }

        if (greenListOrder.includes(query.order)){
            if(query.sort_by === 'author' && query.order === 'desc'){
                queryString += `GROUP BY articles.article_id
                ORDER BY author DESC;`
            }
            if(query.sort_by === 'author' && query.order === 'asc'){
                queryString += `GROUP BY articles.article_id
                ORDER BY author ASC;`
            }
        }
        //all created_at instances
        if(query.sort_by === 'created_at' && query.order === undefined){
            queryString += `GROUP BY articles.article_id
            ORDER BY created_at DESC;`
        }

        if (greenListOrder.includes(query.order)){
            if(query.sort_by === 'created_at' && query.order === 'desc'){
                queryString += `GROUP BY articles.article_id
                ORDER BY created_at DESC;`
            }
            if(query.sort_by === 'created_at' && query.order === 'asc'){
                queryString += `GROUP BY articles.article_id
                ORDER BY created_at ASC;`
            }
        }
        //all article_img_url instances
        if(query.sort_by === 'article_img_url' && query.order === undefined){
            queryString += `GROUP BY articles.article_id
            ORDER BY article_img_url DESC;`
        }

        if (greenListOrder.includes(query.order)){
            if(query.sort_by === 'article_img_url' && query.order === 'desc'){
                queryString += `GROUP BY articles.article_id
                ORDER BY article_img_url DESC;`
            }
            if(query.sort_by === 'article_img_url' && query.order === 'asc'){
                queryString += `GROUP BY articles.article_id
                ORDER BY article_img_url ASC;`
            }
        }
        
    }

    if(queryKeys[0] === 'order' && greenListOrder.includes(query.order)){
        if(query.order === 'asc'){
            queryString += `GROUP BY articles.article_id
            ORDER BY created_at ASC;`
        }
        if(query.order === 'desc'){
            queryString += `GROUP BY articles.article_id
            ORDER BY created_at DESC;`
        }
    }

    if (queryKeys[0] === 'sort_by' && !greenListSortBy.includes(query.sort_by)){
        return Promise.reject({status:400, msg: 'Bad request.'})
    }
    if (queryKeys[1] === 'order' && !greenListOrder.includes(query.order)){
        return Promise.reject({status:400, msg: 'Bad request.'})
    }
    if (queryKeys[0] === 'order' && !greenListOrder.includes(query.order)){
        return Promise.reject({status:400, msg: 'Bad request.'})
    }


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
    return db.query(queryString)
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

