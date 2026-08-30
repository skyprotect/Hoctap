/**
 * GEMINI AI SERVICE
 * Điều phối gọi API Gemini AI với cơ chế xoay vòng Key dự phòng
 */
const EMBEDDED_API_KEYS = [
    'QUl6YVN5Qm0zZy01Nmdlc0xxNVpSMDVvTF8xdnNQSHBHQ0l0RmFz',
    'QVEuQWI4Uk42SUJpdHE4YV96WWVUb2V0MFp4SXpvOUh1LW1veGhMZjNLZGZrQmJ4S0lRQ2c=',
    'QVEuQWI4Uk42S01SQzBEY3NhX3lCN2JiZEZscnVlT0pNTFlOWkNhd3EzUTh5cDVna0F6bFE=',
    'QVEuQWI4Uk42SURlU0tnMTNwN2llUVZBSWVBQmtDMENHb2FaWmxTbS0wVVMwZENFRmJHVUE=',
    'QVEuQWI4Uk42STFJVzNtZEkxOGhCVEpUVjg0bWpjekdSc0FubHZCc1pNcDNlV01rU1JINUE=',
    'QVEuQWI4Uk42S0pEQm5TWGtiVl9SaFB2Q3ZxMHI2QTV0dmZCVUFGY3BMbHp0UllTUDNHRkE='
];

function getActiveGeminiApiKeys() {
    const envKeys = process.env.GEMINI_API_KEY || '';
    const apiKeys = envKeys.split(/[s,;]+/).filter(k => k && k !== 'your_gemini_api_key_here');
    
    if (apiKeys.length > 0) {
        return apiKeys;
    }
    
    try {
        return EMBEDDED_API_KEYS.map(b64 => Buffer.from(b64, 'base64').toString('utf8').trim()).filter(Boolean);
    } catch (e) {
        console.error('Lỗi giải mã embedded keys:', e);
        return [];
    }
}

module.exports = {
    getActiveGeminiApiKeys
};
