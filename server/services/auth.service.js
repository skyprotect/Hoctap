/**
 * AUTH SERVICE
 * Quản lý xác thực JWT Admin và Google OAuth2 Client
 */
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const JWT_SECRET = process.env.JWT_SECRET || 'antigravity_secret_key_123';
const DEFAULT_GOOGLE_CLIENT_ID = "1033910156653-jf5787g1hgbfh9v0onqrs84rl36d2qrl.apps.googleusercontent.com";
const googleClient = new OAuth2Client();

function generateToken(payload, expiresIn = '30m') {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = {
    generateToken,
    verifyToken,
    googleClient,
    JWT_SECRET,
    DEFAULT_GOOGLE_CLIENT_ID
};
