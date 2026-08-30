/**
 * GEMINI KEY MANAGER
 * Quản lý danh sách API Keys, giải mã embedded keys, kiểm tra key hợp lệ và lưu cập nhật .env
 */
import fs from 'fs';
import path from 'path';

export const ROOT_DIR = path.resolve(__dirname, '../../../');

export const EMBEDDED_API_KEYS: string[] = [
    'QUl6YVN5Qm0zZy01Nmdlc0xxNVpSMDVvTF8xdnNQSHBHQ0l0RmFz',
    'QVEuQWI4Uk42SUJpdHE4YV96WWVUb2V0MFp4SXpvOUh1LW1veGhMZjNLZGZrQmJ4S0lRQ2c=',
    'QVEuQWI4Uk42S01SQzBEY3NhX3lCN2JiZEZscnVlT0pNTFlOWkNhd3EzUTh5cDVna0F6bFE=',
    'QVEuQWI4Uk42SURlU0tnMTNwN2llUVZBSWVBQmtDMENHb2FaWmxTbS0wVVMwZENFRmJHVUE=',
    'QVEuQWI4Uk42STFJVzNtZEkxOGhCVEpUVjg0bWpjekdSc0FubHZCc1pNcDNlV01rU1JINUE=',
    'QVEuQWI4Uk42S0pEQm5TWGtiVl9SaFB2Q3ZxMHI2QTV0dmZCVUFGY3BMbHp0UllTUDNHRkE='
];

export function getActiveGeminiApiKeys(): string[] {
    const envKeys = process.env.GEMINI_API_KEY || '';
    const apiKeys = envKeys.split(/[\s,;]+/).filter(k => k && k !== 'your_gemini_api_key_here');
    
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

export const invalidApiKeys = new Set<string>();

export function maskKey(key: string): string {
    if (!key) return 'Không có';
    const trimmed = key.trim();
    return trimmed.length > 12 
        ? `${trimmed.substring(0, 8)}...${trimmed.substring(trimmed.length - 4)}`
        : `${trimmed.substring(0, 3)}...`;
}

export function getActiveKeyAccount(idx: number): string {
    const rawAccounts = process.env.GEMINI_API_ACCOUNTS || '';
    const accounts = rawAccounts.split(',').map(a => a.trim());
    return accounts[idx] || `Tài khoản ${idx + 1}`;
}

export function updateEnvApiKeysAndAccounts(newKeysString: string, newAccountsString: string): void {
    const envPath = path.join(ROOT_DIR, '.env');
    let envContent = '';
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
    }

    const lines = envContent.split(/\r?\n/);
    let keyFound = false;
    let accountsFound = false;
    
    let updatedLines = lines.map(line => {
        if (line.startsWith('GEMINI_API_KEY=')) {
            keyFound = true;
            return `GEMINI_API_KEY=${newKeysString}`;
        }
        if (line.startsWith('GEMINI_API_ACCOUNTS=')) {
            accountsFound = true;
            return `GEMINI_API_ACCOUNTS=${newAccountsString}`;
        }
        return line;
    });

    if (!keyFound) {
        updatedLines.unshift(`GEMINI_API_KEY=${newKeysString}`);
    }
    if (!accountsFound) {
        const keyIndex = updatedLines.findIndex(l => l.startsWith('GEMINI_API_KEY='));
        if (keyIndex !== -1) {
            updatedLines.splice(keyIndex + 1, 0, `GEMINI_API_ACCOUNTS=${newAccountsString}`);
        } else {
            updatedLines.unshift(`GEMINI_API_ACCOUNTS=${newAccountsString}`);
        }
    }

    fs.writeFileSync(envPath, updatedLines.join('\n'), 'utf8');
}
