const {deleteCommentsById} = require('../models/comments');

exports.deleteCommentsById = (req, res, next) =>
{
    const {comment_id} = req.params;
    deleteCommentsById(comment_id)
    .then(() =>
    {
        res.sendStatus(204);
    })
    .catch((err) =>
    {
        next(err);
    });
}