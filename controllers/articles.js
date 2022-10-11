const { selectArticleById, incrementArticleVotesById, insertCommentByArticleId } = require('../models/articles');

exports.getAllArticles = (req, res, next) =>
{
    selectAllArticles()
    .then((articles) =>
    {
        res.status(200).send({articles});
    })
    .catch((err) =>
    {
        next(err);
    });
}

exports.getArticleById = (req, res, next) =>
{
    const { article_id } = req.params;
    selectArticleById(article_id)
    .then((article) =>
    {
        res.status(200).send({article});
    })
    .catch((err) =>
    {
        next(err);
    });
}

exports.patchArticleVotesById = (req, res, next) =>
{
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    incrementArticleVotesById(article_id, inc_votes)
    .then((article) =>
    {
        res.status(200).send({article});
    })
    .catch((err) =>
    {
        next(err);
    });
}

exports.postCommentByArticleId = (req, res, next) =>
{
    const { article_id } = req.params;
    const { body, username } = req.body;
    insertCommentByArticleId(article_id, username, body)
    .then((comment) =>
    {
        res.status(201).send({comment});
    })
    .catch((err) =>
    {
        next(err);
    });
}