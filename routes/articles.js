const express = require('express');
const router = express.Router();

const {getAllArticles, getArticleById, getCommentsByArticleID, patchArticleVotesById} = require('../controllers/articles');

router.get('/', getAllArticles);
router.get('/:article_id', getArticleById);
router.get('/:article_id/comments', getCommentsByArticleID);
router.patch('/:article_id', patchArticleVotesById);

module.exports = router;