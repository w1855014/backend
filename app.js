const express = require('express');
const app = express();
const db = require('./db/connection');

app.use(express.json());

app.use('/api/topics', require('./routes/topics'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/users', require('./routes/users'));
// app.use('/api/comments', require('./routes/comments'));

app.use('/*', (req, res, next) =>
{
    const url  = req.originalUrl;
    const err = new Error(`Endpoint ${url} not found,`);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) =>
{
    if (err.status!==500)
    {
        console.log(`${err.status}: ${err.message}`);
        res.status(err.status).send({msg: err.message});
    }
    else next(err);
})

module.exports = app;