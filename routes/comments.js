const express = require('express');
const router = express.Router();

const {patchCommentVotesById, deleteCommentsById} = require('../controllers/comments');

router.patch('/:comment_id', patchCommentVotesById);
router.delete('/:comment_id', deleteCommentsById);

module.exports = router;