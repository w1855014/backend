const { selectArticleById, selectCommentsByArticleId, incrementArticleVotesById } = require('../models/articles');

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

exports.getCommentsByArticleID = (req, res, next) =>
{
    const { article_id } = req.params;
    selectCommentsByArticleId(article_id)
    .then((comments) =>
    {
        res.status(200).send({comments});
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