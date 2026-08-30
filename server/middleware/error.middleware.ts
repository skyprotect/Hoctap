/**
 * ERROR MIDDLEWARE
 * Global error handlers cho Express application
 */
import { Request, Response, NextFunction } from 'express';

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: `API endpoint ${req.method} ${req.path} không tồn tại` });
    }
    next();
}

export function globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error('❌ [Global Error Handler]:', err);
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.status || 500).json({
        error: err.message || 'Đã xảy ra lỗi máy chủ nội bộ',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
}
