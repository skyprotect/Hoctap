/**
 * MOCK SERVER HELPER
 * Khởi tạo Express Test App độc lập cho Supertest
 */
const express = require('express');
const cors = require('cors');

function createMockApp() {
    const app = express();
    app.use(cors());
    app.use(express.json({ limit: '10mb' }));

    app.use('/api/auth', require('../../server/routes/auth.routes'));
    app.use('/api', require('../../server/routes/auth.routes'));
    app.use('/api', require('../../server/routes/student.routes'));
    app.use('/api', require('../../server/routes/quiz.routes'));
    app.use('/api', require('../../server/routes/admin.routes'));
    app.use('/api', require('../../server/routes/system.routes'));

    return app;
}

module.exports = {
    createMockApp
};
