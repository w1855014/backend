const express = require('express');
const router = express.Router();

const {getAllArticles, getArticleById, patchArticleVotesById} = require('../controllers/articles');

router.get('/', getAllArticles);
router.get('/:article_id', getArticleById);
router.patch('/:article_id', patchArticleVotesById);

module.exports = router;