const express = require('express');
const app = express();
const db = require('./db/connection');

const topicRouter = require('./routes/topics');
const articleRouter = require('./routes/articles');
const userRouter = require('./routes/users');
const commentRouter = require('./routes/comments');
app.use(express.json());

app.use('/api/topics', topicRouter);
app.use('/api/articles', articleRouter);
app.use('/api/users', userRouter);
app.use('/api/comments', commentRouter);

app.use('/*', (req, res, next) =>
{
    res.status(404).send({msg: "Invalid endpoint."});
});

app.use((err, req, res, next) =>
{
    if (err.code === "22P02" || err.code === "23502")
    {
        res.status(400).send({msg: "Bad request."});
    }
    next(err);
})

app.use((err, req, res, next) =>
{
    console.log(err);
    if (err.status!==500)
    {
        console.log(`${err.status}: ${err.message}`);
        res.status(err.status).send({msg: err.message});
    }
    else next(err);
})

module.exports = app;