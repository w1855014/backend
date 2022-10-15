const { selectAllTopics, insertTopic } = require('../models/topics');

exports.getAllTopics = (req, res, next) =>
{
    selectAllTopics()
    .then((topics) =>
    {
        res.status(200).send({topics});
    })
    .catch((err) =>
    {
        next(err);
    });
}

exports.postTopic = (req, res, next) =>
{
    const {slug, description} = req.body;
    insertTopic(slug, description)
    .then((topic) =>
    {
        res.status(201).send({topic});
    })
    .catch((err) =>
    {
        next(err);
    });
}