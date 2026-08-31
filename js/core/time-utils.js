/**
 * time-utils — Bộ tiện ích định dạng thời gian, đếm ngược, đồng hồ và ngày tháng chuẩn Việt Nam.
 * Hỗ trợ các chức năng chuyển đổi giây sang chuỗi đếm ngược, định dạng ngày tháng tiếng Việt.
 * 
 * Public Contract:
 * - padZero(n: number|string, width?: number): string
 * - formatDuration(totalSeconds: number): string
 * - formatCountdown(totalSeconds: number): string
 * - formatDateTimeVN(dateInput: Date|string|number): string
 * - formatDateVN(dateInput: Date|string|number): string
 * - getTodayDateString(dateInput?: Date|string|number): string
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.TimeUtils = api;
    if (typeof window !== 'undefined') {
        window.TimeUtils = api;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.TimeUtils = api;
    }
    if (typeof self !== 'undefined') {
        self.TimeUtils = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    /**
     * Thêm số 0 vào đầu số nguyên nếu độ dài nhỏ hơn width
     * @param {number|string} n 
     * @param {number} [width=2] 
     * @returns {string}
     */
    function padZero(n, width = 2) {
        const num = n != null ? String(n) : '0';
        return num.padStart(width, '0');
    }

    /**
     * Chuyển đổi tổng số giây thành định dạng chuỗi thời gian mm:ss hoặc hh:mm:ss
     * @param {number} totalSeconds 
     * @returns {string} Ví dụ: 125 -> "02:05", 3665 -> "01:01:05"
     */
    function formatDuration(totalSeconds) {
        const sec = Math.max(0, Math.floor(Number(totalSeconds) || 0));
        const hours = Math.floor(sec / 3600);
        const minutes = Math.floor((sec % 3600) / 60);
        const seconds = sec % 60;

        if (hours > 0) {
            return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
        }
        return `${padZero(minutes)}:${padZero(seconds)}`;
    }

    /**
     * Chuyển đổi giây thành chuỗi đếm ngược mm:ss
     * @param {number} totalSeconds 
     * @returns {string} Ví dụ: 65 -> "01:05"
     */
    function formatCountdown(totalSeconds) {
        const sec = Math.max(0, Math.floor(Number(totalSeconds) || 0));
        const minutes = Math.floor(sec / 60);
        const seconds = sec % 60;
        return `${padZero(minutes)}:${padZero(seconds)}`;
    }

    /**
     * Định dạng ngày giờ chuẩn Việt Nam: "DD/MM/YYYY HH:mm"
     * @param {Date|string|number} [dateInput=new Date()] 
     * @returns {string}
     */
    function formatDateTimeVN(dateInput) {
        if (!dateInput) return "";
        const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
        if (isNaN(d.getTime())) return "";

        const day = padZero(d.getDate());
        const month = padZero(d.getMonth() + 1);
        const year = d.getFullYear();
        const hours = padZero(d.getHours());
        const minutes = padZero(d.getMinutes());

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    /**
     * Định dạng ngày chuẩn Việt Nam: "DD/MM/YYYY"
     * @param {Date|string|number} [dateInput=new Date()] 
     * @returns {string}
     */
    function formatDateVN(dateInput) {
        if (!dateInput) return "";
        const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
        if (isNaN(d.getTime())) return "";

        const day = padZero(d.getDate());
        const month = padZero(d.getMonth() + 1);
        const year = d.getFullYear();

        return `${day}/${month}/${year}`;
    }

    /**
     * Lấy chuỗi ngày ISO theo múi giờ địa phương: "YYYY-MM-DD"
     * @param {Date|string|number} [dateInput=new Date()] 
     * @returns {string}
     */
    function getTodayDateString(dateInput) {
        const d = dateInput ? (dateInput instanceof Date ? dateInput : new Date(dateInput)) : new Date();
        if (isNaN(d.getTime())) return "";

        const year = d.getFullYear();
        const month = padZero(d.getMonth() + 1);
        const day = padZero(d.getDate());

        return `${year}-${month}-${day}`;
    }

    const TimeUtils = {
        padZero: padZero,
        formatDuration: formatDuration,
        formatCountdown: formatCountdown,
        formatDateTimeVN: formatDateTimeVN,
        formatDateVN: formatDateVN,
        getTodayDateString: getTodayDateString
    };

    return TimeUtils;
});
