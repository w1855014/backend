const db = require('../db/connection');

exports.incrementCommentVotesById = (id, inc_votes) =>
{
    return db.query(`UPDATE comments SET votes = votes + $2 WHERE comment_id = $1 RETURNING*;`, [id, inc_votes])
    .then(({rows}) =>
    {
        if (!rows.length)
        {
            return Promise.reject({message: "Not found.", status:404});
        }
        return rows[0];
    })
}

exports.deleteCommentsById = (id) =>
{
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [id])
    .then(({rows}) =>
    {
        if (!rows.length)
        {
            return Promise.reject({message: "Not found.", status:404});
        }
        return Promise.resolve();
    })
}