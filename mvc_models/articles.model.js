const db = require("../db/connection");


exports.selectArticles = (query) => {
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
    if (query.topic === undefined) {
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
}

exports.selectArticleById = (id) => {
    
        return db.query(`
        SELECT * FROM articles WHERE article_id = $1;`, [id])
        .then((result) =>{
            if(result.rows.length === 0){
                return Promise.reject({status:404, msg: 'Article does not exist.'})
            }
            else { 
                return result
            }
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