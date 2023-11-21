const db = require("../db/connection");

exports.selectArticles = () => {
    let articles 
    return db.query(`
    SELECT title, topic, author, created_at, article_id, article_img_url 
    FROM articles
    ORDER BY created_at DESC;`)
    .then(({rows}) => {
        articles = rows
        const promisePends = []
        rows.forEach((row) => {
            const id = row.article_id
            promisePends.push(db.query(`SELECT * FROM comments WHERE article_id = $1;`, [id]))
        })
        return Promise.all(promisePends)
    })
    .then((results) => {
        for(let i = 0 ; i < results.length; i++) {
            const element = results[i]
            articles[i].comment_count = element.rows.length
        }
        return articles
    })
}