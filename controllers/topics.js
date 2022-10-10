const { selectAllTopics } = require('../models/topics');

exports.getAllTopics = (req, res, next) =>
{
    selectAllTopics()
    .then((topics) =>
    {
        res.status(200).json(topics);
    })
    .catch((err) =>
    {
        next(err);
    });
}