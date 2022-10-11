const express = require('express');
const router = express.Router();

const {getAllArticles, getArticleById, patchArticleVotesById, postCommentByArticleId} = require('../controllers/articles');

router.get('/', getAllArticles);
router.get('/:article_id', getArticleById);
router.patch('/:article_id', patchArticleVotesById);
router.post('/:article_id/comments', postCommentByArticleId);

module.exports = router;