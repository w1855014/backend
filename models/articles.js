const db = require('../db/connection');



exports.selectArticleById = (id) =>
{
    return db.query(`SELECT *,
    (SELECT count(*) FROM comments c WHERE c.article_id = a.article_id)
    AS comment_count FROM articles a WHERE article_id = $1;`, [id])
    .then(({rows}) =>
    {
        console.log(rows);
        if (!rows.length)
        {
            const err = new Error(`Not found,`);
            err.status = 404;
            return Promise.reject(err);
        }
        return rows[0];
    })
    .catch((err) =>
    {
        return Promise.reject(err);
    });
};



exports.selectAllArticles = (topic) =>
{
    if (topic===undefined)
    {
        return db.query(`SELECT *,
        (SELECT count(*) FROM comments c WHERE c.article_id = a.article_id)
        AS comment_count FROM articles a ORDER BY created_at DESC;`)
        .then(({rows}) =>
        {
            return rows;
        })
    }
    return db.query(`SELECT *,
    (SELECT count(*) FROM comments c WHERE c.article_id = a.article_id)
    AS comment_count FROM articles a WHERE a.topic = $1 ORDER BY created_at DESC;`, [topic])
    .then(({rows}) =>
    {
        return rows;
    })
    .catch((err) =>
    {
        return Promise.reject(err);
    });
}

exports.selectArticleById = (id) =>
{
    return db.query(`SELECT *,
    (SELECT count(*) FROM comments c WHERE c.article_id = a.article_id)
    AS comment_count FROM articles a WHERE article_id = $1;`, [id])
    .then(({rows}) =>
    {
        console.log(rows);
        if (!rows.length)
        {
            const err = new Error(`Not found,`);
            err.status = 404;
            return Promise.reject(err);
        }
        return rows[0];
    })
    .catch((err) =>
    {
        return Promise.reject(err);
    });
};


exports.incrementArticleVotesById = (id, inc_votes) =>
{
    // if(isNaN(parseInt(id)) || isNaN(parseInt(inc_votes)))
    // {
    //     const err = new Error("Bad request.");
    //     err.status = 400;
    //     return Promise.reject(err);
    // }
    return db.query(`UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING*;`, [id, inc_votes])
    .then(({rows}) =>
    {
        if (!rows.length)
        {
            const err = new Error(`Not found.`);
            err.status = 404;
            return Promise.reject(err);
        }
        console.log(rows)
        return rows[0];
    })
}