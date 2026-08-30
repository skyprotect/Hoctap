/**
 * AUTH SERVICE
 * Quản lý xác thực JWT Admin và Google OAuth2 Client
 */
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

export const JWT_SECRET = process.env.JWT_SECRET || 'antigravity_secret_key_123';
export const DEFAULT_GOOGLE_CLIENT_ID = "1033910156653-jf5787g1hgbfh9v0onqrs84rl36d2qrl.apps.googleusercontent.com";
export const googleClient = new OAuth2Client();

export function generateToken(payload: object, expiresIn: string = '30m'): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn } as any);
}

export function verifyToken(token: string): any {
    return jwt.verify(token, JWT_SECRET);
}
