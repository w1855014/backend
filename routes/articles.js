const express = require('express');
const router = express.Router();

const {getAllArticles, getArticleById, getCommentsByArticleID, patchArticleVotesById, postCommentByArticleId} = require('../controllers/articles');

router.get('/', getAllArticles);
router.get('/:article_id', getArticleById);
router.get('/:article_id/comments', getCommentsByArticleID);
router.patch('/:article_id', patchArticleVotesById);
router.post('/:article_id/comments', postCommentByArticleId);

module.exports = router;