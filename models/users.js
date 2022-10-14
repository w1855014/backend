const db = require('../db/connection');

exports.selectAllUsers = () =>
{
    return db.query(`SELECT * FROM users;`)
    .then(({rows}) =>
    {
        return rows;
    })
    .catch((err) =>
    {
        return Promise.reject(err);
    })
};

exports.selectUserById = (username) =>
{
    return db.query(`SELECT * FROM users WHERE username = $1;`, [username])
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