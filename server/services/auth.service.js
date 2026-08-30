/**
 * AUTH SERVICE
 * Quản lý xác thực JWT Admin và Google OAuth2 Client
 */
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const JWT_SECRET = process.env.JWT_SECRET || 'antigravity_secret_key_123';
const googleClient = new OAuth2Client();

function authenticateAdminToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: "Yêu cầu đăng nhập!" });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Phiên đăng nhập hết hạn hoặc không hợp lệ!" });
        }
        req.user = user;
        next();
    });
}

function generateToken(payload, expiresIn = '7d') {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

module.exports = {
    authenticateAdminToken,
    generateToken,
    googleClient,
    JWT_SECRET
};
