const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Log in and receive a JWT
 *     tags: [Auth]
 */
router.post('/login', login);

module.exports = router;
