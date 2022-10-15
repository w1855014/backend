const express = require('express');
const router = express.Router();

const {getAllTopics,postTopic} = require('../controllers/topics');

router.get('/', getAllTopics);
router.post('/', postTopic);

module.exports = router;