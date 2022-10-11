const express = require('express');
const router = express.Router();

const {deleteCommentsById} = require('../controllers/comments');

router.delete('/:comment_id', deleteCommentsById);

module.exports = router;
