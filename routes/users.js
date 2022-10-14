const express = require('express');
const router = express.Router();

const {getAllUsers, getUserById} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:username', getUserById);

module.exports = router;