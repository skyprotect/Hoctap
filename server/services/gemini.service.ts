/**
 * GEMINI AI SERVICE (FAÇADE)
 * Re-export toàn bộ chức năng AI từ các module chuyên biệt:
 * - gemini-key-manager: Quản lý API keys, mask, .env
 * - gemini-client: Gọi HTTP API Gemini, retry, backoff, status
 * - response-parser: Làm sạch JSON, khử prompt injection
 * - prompt-builder: Các prompt template cho Toán & Tiếng Anh
 * - ai-auditor: AI Auditor 4-step pipeline, self-healing
 * - pregen-worker: Quản lý cache, danh sách bài học và tiến trình sinh ngầm
 */

export * from './ai/gemini-key-manager';
export * from './ai/gemini-client';
export * from './ai/response-parser';
export * from './ai/prompt-builder';
export * from './ai/ai-auditor';
export * from './ai/pregen-worker';
