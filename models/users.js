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
        if (!rows.length)
        {
            return Promise.reject({message: "Not found.", status:404});
        }
        return rows[0];
    })
    .catch((err) =>
    {
        return Promise.reject(err);
    });
};