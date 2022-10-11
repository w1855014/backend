const db = require('../db/connection');

// exports.selectAllArticles = (topic) =>
// {
//     if (topic===undefined)
//     {
//         return db.query(`SELECT * FROM articles ORDER BY created_at DESC;`)
//         .then(({rows}) =>
//         {
//             return rows;
//         })
//     }
//     return db.query(`SELECT * FROM articles WHERE topic.slug = $1`, [topic])
//     .then(({rows}) =>
//     {
//         return rows;
//     })
//     .catch((err) =>
//     {
//         return Promise.reject(err);
//     });
// }

// exports.selectArticleById = (id) =>
// {
//     return db.query(`SELECT *, count(article_id) FROM articles, comments WHERE article_id=${id} AND comments.article_id = article_id GROUP BY article_id;`)
//     .then(({rows}) =>
//     {
//         console.log(rows);
//         if (!rows.length)
//         {
//             const err = new Error(`Article ID: ${id} not found,`);
//             err.status = 404;
//             return Promise.reject(err);
//         }
//         return rows[0];
//     })
//     .catch((err) =>
//     {
//         return Promise.reject(err);
//     });
// };


exports.selectCommentsByArticleId = (id) =>
{
    return db.query(`SELECT * FROM comments WHERE article_id=$1`, [id])
    .then(({rows}) =>
    {
        if (!rows.length)
        {
            const err = new Error(`Not found.`);
            err.status = 404;
            return Promise.reject(err);
        }
        return rows;
    })
    .catch((err) =>
    {
        return Promise.reject(err);
    });
}

exports.selectArticleById = (id) =>
{
    return db.query(`SELECT * FROM articles WHERE article_id=${id};`)
    .then(({rows}) =>
    {
        if (!rows.length)
        {
            const err = new Error(`Article ID: ${id} not found.`);
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