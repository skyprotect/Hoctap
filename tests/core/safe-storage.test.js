/**
 * Unit & Characterization Tests for safeStorage module (js/core/safe-storage.js)
 * 
 * Đảm bảo 100% contract:
 * - getItem(key)
 * - setItem(key, value)
 * - removeItem(key)
 * - fallback
 * - Xử lý an toàn khi localStorage throw (QuotaExceededError, SecurityError)
 * - Missing key, empty string, JSON payloads lớn
 */

const safeStorage = require('../../js/core/safe-storage');

describe("Unit Tests — safeStorage (js/core/safe-storage.js)", () => {
    let originalLocalStorage;
    let mockStorageStore = {};

    beforeEach(() => {
        // Reset fallback
        safeStorage.fallback = {};
        mockStorageStore = {};

        // Lưu bản gốc và tạo mock localStorage
        originalLocalStorage = global.localStorage;
        global.localStorage = {
            getItem: jest.fn((key) => {
                return Object.prototype.hasOwnProperty.call(mockStorageStore, key) 
                    ? mockStorageStore[key] 
                    : null;
            }),
            setItem: jest.fn((key, value) => {
                mockStorageStore[key] = String(value);
            }),
            removeItem: jest.fn((key) => {
                delete mockStorageStore[key];
            }),
            clear: jest.fn(() => {
                mockStorageStore = {};
            })
        };
    });

    afterEach(() => {
        global.localStorage = originalLocalStorage;
    });

    // 1. Contract & Shape
    describe("1. Public Contract & Structure", () => {
        test("safeStorage phải export đúng các phương thức và thuộc tính trong contract", () => {
            expect(safeStorage).toBeDefined();
            expect(typeof safeStorage.getItem).toBe('function');
            expect(typeof safeStorage.setItem).toBe('function');
            expect(typeof safeStorage.removeItem).toBe('function');
            expect(typeof safeStorage.fallback).toBe('object');
        });
    });

    // 2. Standard Operations
    describe("2. Standard CRUD Operations", () => {
        test("setItem và getItem hoạt động chính xác với chuỗi thông thường", () => {
            safeStorage.setItem("user_name", "Bình Minh");
            expect(global.localStorage.setItem).toHaveBeenCalledWith("user_name", "Bình Minh");
            expect(safeStorage.getItem("user_name")).toBe("Bình Minh");
        });

        test("removeItem xóa bỏ giá trị đã lưu", () => {
            safeStorage.setItem("temp_key", "temp_value");
            expect(safeStorage.getItem("temp_key")).toBe("temp_value");

            safeStorage.removeItem("temp_key");
            expect(global.localStorage.removeItem).toHaveBeenCalledWith("temp_key");
            expect(safeStorage.getItem("temp_key")).toBeNull();
        });

        test("setItem tự động ép kiểu value sang string", () => {
            safeStorage.setItem("score", 100);
            expect(safeStorage.getItem("score")).toBe("100");

            safeStorage.setItem("is_active", true);
            expect(safeStorage.getItem("is_active")).toBe("true");
        });
    });

    // 3. Edge Cases: Missing Key, Empty String, Large JSON
    describe("3. Edge Cases (Missing key, Empty string, Large JSON)", () => {
        test("Đọc missing key trả về null", () => {
            expect(safeStorage.getItem("non_existent_key_xyz")).toBeNull();
        });

        test("Lưu và đọc chuỗi rỗng '' trả về chính xác '' thay vì null", () => {
            safeStorage.setItem("empty_str", "");
            expect(safeStorage.getItem("empty_str")).toBe("");
        });

        test("Lưu và đọc chuỗi JSON phức tạp và dữ liệu lớn (> 100KB)", () => {
            const largeArray = [];
            for (let i = 0; i < 2000; i++) {
                largeArray.push({ id: i, name: `Student_${i}`, score: i * 1.5, completed: i % 2 === 0 });
            }
            const jsonStr = JSON.stringify(largeArray);
            expect(jsonStr.length).toBeGreaterThan(100000); // > 100KB

            safeStorage.setItem("large_payload", jsonStr);
            const retrieved = safeStorage.getItem("large_payload");
            expect(retrieved).toBe(jsonStr);

            const parsed = JSON.parse(retrieved);
            expect(parsed.length).toBe(2000);
            expect(parsed[100].name).toBe("Student_100");
        });
    });

    // 4. Exception Handling & In-Memory RAM Fallback
    describe("4. Fallback Handling on Storage Exceptions", () => {
        test("Tự động fallback vào RAM khi setItem ném QuotaExceededError", () => {
            const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

            global.localStorage.setItem = jest.fn(() => {
                const error = new Error("QuotaExceededError: The quota has been exceeded.");
                error.name = "QuotaExceededError";
                throw error;
            });

            // Ghi dữ liệu không được làm sập ứng dụng
            expect(() => {
                safeStorage.setItem("quota_key", "quota_value");
            }).not.toThrow();

            // Dữ liệu phải được lưu vào safeStorage.fallback
            expect(safeStorage.fallback["quota_key"]).toBe("quota_value");

            // getItem đọc được từ fallback
            // Giả lập localStorage.getItem không tìm thấy (do lúc setItem bị lỗi)
            global.localStorage.getItem = jest.fn(() => null);
            expect(safeStorage.getItem("quota_key")).toBe("quota_value");

            warnSpy.mockRestore();
        });

        test("Tự động fallback vào RAM khi getItem ném SecurityError (Private browsing)", () => {
            const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

            // Đặt sẵn dữ liệu trong RAM fallback
            safeStorage.fallback["private_key"] = "private_value";

            global.localStorage.getItem = jest.fn(() => {
                const error = new Error("SecurityError: Access is denied for this document.");
                error.name = "SecurityError";
                throw error;
            });

            // Đọc không được crash mà trả về dữ liệu fallback
            expect(() => {
                const val = safeStorage.getItem("private_key");
                expect(val).toBe("private_value");
            }).not.toThrow();

            // Nếu key không có trong fallback, trả về null
            expect(safeStorage.getItem("missing_private_key")).toBeNull();

            warnSpy.mockRestore();
        });

        test("Tự động xóa khỏi fallback khi removeItem ném ngoại lệ", () => {
            const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

            safeStorage.fallback["key_to_delete"] = "del_val";

            global.localStorage.removeItem = jest.fn(() => {
                throw new Error("Disk IO Error");
            });

            expect(() => {
                safeStorage.removeItem("key_to_delete");
            }).not.toThrow();

            expect(safeStorage.fallback["key_to_delete"]).toBeUndefined();

            warnSpy.mockRestore();
        });

        test("Hoạt động hoàn toàn ổn định khi localStorage là undefined (môi trường không hỗ trợ)", () => {
            const temp = global.localStorage;
            delete global.localStorage;

            expect(() => {
                safeStorage.setItem("no_storage_key", "ram_only_value");
                expect(safeStorage.getItem("no_storage_key")).toBe("ram_only_value");
                expect(safeStorage.getItem("unknown_key")).toBeNull();
                safeStorage.removeItem("no_storage_key");
                expect(safeStorage.getItem("no_storage_key")).toBeNull();
            }).not.toThrow();

            global.localStorage = temp;
        });
    });
});
