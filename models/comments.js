const db = require('../db/connection');

exports.deleteCommentsById = (id) =>
{
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [id])
    .then(({rows}) =>
    {
        if (!rows.length)
        {
            const err = new Error(`Not found.`);
            err.status = 404;
            return Promise.reject(err);
        }
        return Promise.resolve();
    })
}