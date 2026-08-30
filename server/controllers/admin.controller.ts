/**
 * ADMIN CONTROLLER
 * Tầng giao tiếp HTTP cho khu vực quản trị: trích xuất params/body, gọi Admin Application Service và phản hồi JSON
 */
import { Request, Response } from 'express';
import * as adminService from '../services/admin.service';
import { getAdminUserFromRequest } from '../middleware/auth.middleware';

export function getApiKeys(req: Request, res: Response): void {
    const info = adminService.getApiKeysInfo();
    res.json(info);
}

export async function saveApiKeys(req: Request, res: Response): Promise<any> {
    const { keys, parentPin } = req.body;
    if (!keys || !Array.isArray(keys)) {
        return res.status(400).json({ error: "Thiếu danh sách keys hoặc dữ liệu không hợp lệ." });
    }

    try {
        const result = await adminService.saveApiKeys({ keys, parentPin });
        if (!result.success) {
            return res.status(result.status || 403).json({ error: result.error });
        }
        res.json({ success: true, count: result.count });
    } catch (err: any) {
        console.error("Lỗi khi lưu API Key:", err);
        res.status(500).json({ error: "Lỗi ghi file cấu hình trên server: " + err.message });
    }
}

export async function testApiKeys(req: Request, res: Response): Promise<void> {
    const { keys } = req.body;
    try {
        const results = await adminService.testApiKeys(keys);
        res.json({ results });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function loadConfig(req: Request, res: Response): Promise<any> {
    try {
        const adminUser = getAdminUserFromRequest(req);
        const config = await adminService.loadConfig(!!adminUser);
        res.json(config);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function saveConfig(req: Request, res: Response): Promise<void> {
    try {
        const newConfig = req.body || {};
        const adminUser = getAdminUserFromRequest(req);
        await adminService.saveConfig(newConfig, !!adminUser);
        res.json({ success: true });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function setupInitial(req: Request, res: Response): Promise<any> {
    try {
        const { parentName, parentPin, studentName, classLevel } = req.body;
        if (!parentName || !parentPin || !studentName || !classLevel) {
            return res.status(400).json({ error: "Thiếu thông tin thiết lập bắt buộc." });
        }

        const studentId = await adminService.setupInitial({ parentName, parentPin, studentName, classLevel });
        res.json({ success: true, studentId });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function syncLocalData(req: Request, res: Response): Promise<void> {
    try {
        const data = await adminService.syncLocalData();
        res.json({ success: true, data });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export async function syncSavePulledData(req: Request, res: Response): Promise<void> {
    const { config, students } = req.body;
    try {
        await adminService.syncSavePulledData({ config, students });
        res.json({ success: true, message: "Đã đồng bộ dữ liệu đám mây về thiết bị cục bộ thành công!" });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export function exitKiosk(req: Request, res: Response): void {
    adminService.exitKiosk().then(() => {
        res.json({ success: true, message: "Đã gửi lệnh tắt Kiosk Mode" });
    }).catch((err: any) => {
        res.status(500).json({ error: err.message });
    });
}
