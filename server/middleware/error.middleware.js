/**
 * ERROR MIDDLEWARE
 * Global error handlers cho Express application
 */

function notFoundHandler(req, res, next) {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: `API endpoint ${req.method} ${req.path} không tồn tại` });
    }
    next();
}

function globalErrorHandler(err, req, res, next) {
    console.error('❌ [Global Error Handler]:', err);
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.status || 500).json({
        error: err.message || 'Đã xảy ra lỗi máy chủ nội bộ',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
}

module.exports = {
    notFoundHandler,
    globalErrorHandler
};
