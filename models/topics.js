const db = require('../db/connection');

exports.selectAllTopics = () =>
{
    return db.query(`SELECT * FROM topics;`)
    .then(({rows}) =>
    {
        return rows;
    });
};

exports.insertTopic = (slug, description) =>
{
    return db.query(`INSERT INTO topics (slug, description)
    VALUES ($1, $2) RETURNING *;`, [slug, description])
    .then(({rows}) =>
    {
        if (!rows.length)
        {
            return Promise.reject({message: "Not found.", status:404});
        }
        return rows[0];
    });
}