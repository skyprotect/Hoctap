/**
 * AUTH MIDDLEWARE
 * Middleware xác thực token Admin và trích xuất thông tin người dùng từ request
 */
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'antigravity_secret_key_123';

function authenticateAdminToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
        return res.status(401).json({ error: "Yêu cầu đăng nhập!" });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Phiên làm việc hết hạn hoặc Token không hợp lệ!" });
        }
        req.user = user;
        next();
    });
}

function getAdminUserFromRequest(req) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return null;
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (e) {
        return null;
    }
}

module.exports = {
    authenticateAdminToken,
    getAdminUserFromRequest,
    JWT_SECRET
};
