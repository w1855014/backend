const { selectAllArticles, selectArticleById, incrementArticleVotesById } = require('../models/articles');

exports.getAllArticles = (req, res, next) =>
{
    const { topic } = req.query;
    selectAllArticles(topic)
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