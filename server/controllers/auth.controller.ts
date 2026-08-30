/**
 * AUTH CONTROLLER
 * Tầng giao tiếp HTTP cho xác thực: trích xuất params/body, gọi Auth Service và phản hồi JSON
 */
import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export function getGoogleClientId(req: Request, res: Response): void {
    res.json({ clientId: authService.getGoogleClientId() });
}

export async function getSession(req: Request, res: Response): Promise<void> {
    const result = await authService.getSession();
    res.json(result);
}

export async function googleLogin(req: Request, res: Response): Promise<void> {
    const { idToken, firebaseUid, email, displayName } = req.body || {};
    try {
        const parentSession = await authService.processGoogleLogin({ idToken, firebaseUid, email, displayName });
        res.json({ success: true, parentSession });
    } catch (error: any) {
        console.error("Lỗi xử lý đăng nhập Google:", error);
        res.status(500).json({ error: "Xử lý đăng nhập thất bại: " + error.message });
    }
}

export async function logout(req: Request, res: Response): Promise<void> {
    try {
        await authService.logoutAndResetDevice();
        res.json({ success: true, message: "Đã đăng xuất và reset thiết bị thành công" });
    } catch (error: any) {
        console.error("Lỗi khi reset thiết bị:", error);
        res.status(500).json({ error: "Lỗi reset thiết bị: " + error.message });
    }
}

export async function adminLogin(req: Request, res: Response): Promise<any> {
    const { password, pin } = req.body || {};
    const inputPin = password || pin;
    try {
        const result = await authService.adminLogin(inputPin);
        if (!result.success) {
            return res.status(result.status || 401).json({ error: result.error });
        }
        return res.json({ success: true, token: result.token });
    } catch (e: any) {
        console.error("Lỗi đăng nhập:", e);
        return res.status(500).json({ error: "Lỗi máy chủ khi đăng nhập: " + e.message });
    }
}

export async function verifyPin(req: Request, res: Response): Promise<any> {
    const { pin } = req.body || {};
    try {
        const result = await authService.verifyPin(pin);
        if (!result.success) {
            return res.status(result.status || 403).json({ success: false, error: result.error });
        }
        return res.json({ success: true });
    } catch (e: any) {
        console.error("Lỗi xác thực PIN:", e);
        return res.status(500).json({ error: "Lỗi máy chủ khi xác thực PIN: " + e.message });
    }
}
