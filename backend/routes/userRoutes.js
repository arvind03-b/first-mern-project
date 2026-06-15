const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define REST routes (mapped from base /users)
router.post('/', userController.createUser);
router.get('/', userController.getUsers);

module.exports = router;
