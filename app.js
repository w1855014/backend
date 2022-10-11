const express = require('express');
const app = express();
const db = require('./db/connection');

const topicRouter = require('./routes/topics');
const articleRouter = require('./routes/articles');
const userRouter = require('./routes/users');

app.use(express.json());

app.use('/api/topics', topicRouter);
app.use('/api/articles', articleRouter);
app.use('/api/users', userRouter);
// app.use('/api/comments', require('./routes/comments'));

app.use('/*', (req, res, next) =>
{
    res.status(404).send({msg: "Invalid endpoint."});
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