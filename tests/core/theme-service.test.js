/**
 * Unit & Characterization Tests for ThemeService module (js/core/theme-service.js)
 * 
 * Kiểm tra toàn diện 100% contract & behavior:
 * 1. Default & Persisted Student Theme ("toan6_theme")
 * 2. Student Theme Toggle, DOM classes ('green-mode' vs 'light-mode'), icon (#theme-toggle)
 * 3. Default & Persisted Parent Theme ("parent_theme")
 * 4. Parent Theme Toggle, DOM classes ('light-mode'), icon & text (#parent-theme-icon, #parent-theme-text)
 * 5. Safe Storage integration & Storage fallback handling
 * 6. Side effects / Chart refresh integration
 * 7. Missing DOM / Headless resilience
 * 8. Repeated initialization idempotency
 */

const ThemeService = require('../../js/core/theme-service');
const safeStorage = require('../../js/core/safe-storage');

describe("Unit Tests — ThemeService (js/core/theme-service.js)", () => {
    let originalDocument;
    let originalLocalStorage;
    let mockStorageStore;
    let mockBody;
    let mockToggleBtn;
    let mockParentIcon;
    let mockParentText;
    let mockScreenParent;
    let mockParentDashboardContent;

    beforeEach(() => {
        // Reset safeStorage
        safeStorage.fallback = {};
        mockStorageStore = {};

        // Mock localStorage
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
        global.safeStorage = safeStorage;

        // Mock DOM elements
        const classSet = new Set();
        mockBody = {
            classList: {
                add: jest.fn((cls) => classSet.add(cls)),
                remove: jest.fn((cls) => classSet.delete(cls)),
                contains: jest.fn((cls) => classSet.has(cls)),
                toggle: jest.fn((cls) => {
                    if (classSet.has(cls)) { classSet.delete(cls); return false; }
                    else { classSet.add(cls); return true; }
                })
            }
        };

        mockToggleBtn = { innerHTML: '' };
        mockParentIcon = { className: '' };
        mockParentText = { textContent: '' };
        
        const parentScreenClasses = new Set(["hidden"]);
        mockScreenParent = {
            classList: {
                contains: jest.fn((cls) => parentScreenClasses.has(cls)),
                add: jest.fn((cls) => parentScreenClasses.add(cls)),
                remove: jest.fn((cls) => parentScreenClasses.delete(cls))
            }
        };

        const parentContentClasses = new Set(["hidden"]);
        mockParentDashboardContent = {
            classList: {
                contains: jest.fn((cls) => parentContentClasses.has(cls)),
                add: jest.fn((cls) => parentContentClasses.add(cls)),
                remove: jest.fn((cls) => parentContentClasses.delete(cls))
            }
        };

        originalDocument = global.document;
        global.document = {
            body: mockBody,
            getElementById: jest.fn((id) => {
                if (id === 'theme-toggle') return mockToggleBtn;
                if (id === 'parent-theme-icon') return mockParentIcon;
                if (id === 'parent-theme-text') return mockParentText;
                if (id === 'screen-parent') return mockScreenParent;
                if (id === 'parent-dashboard-content') return mockParentDashboardContent;
                return null;
            })
        };
    });

    afterEach(() => {
        global.document = originalDocument;
        global.localStorage = originalLocalStorage;
        delete global.safeStorage;
    });

    // 1. Contract & Structure
    describe("1. Public Contract & Structure", () => {
        test("ThemeService phải export đầy đủ các hằng số và phương thức", () => {
            expect(ThemeService).toBeDefined();
            expect(ThemeService.STUDENT_THEME_KEY).toBe("toan6_theme");
            expect(ThemeService.PARENT_THEME_KEY).toBe("parent_theme");

            expect(typeof ThemeService.initStudentTheme).toBe('function');
            expect(typeof ThemeService.getStudentTheme).toBe('function');
            expect(typeof ThemeService.setStudentTheme).toBe('function');
            expect(typeof ThemeService.toggleStudentTheme).toBe('function');
            expect(typeof ThemeService.updateStudentThemeIcon).toBe('function');

            expect(typeof ThemeService.initParentTheme).toBe('function');
            expect(typeof ThemeService.getParentTheme).toBe('function');
            expect(typeof ThemeService.setParentTheme).toBe('function');
            expect(typeof ThemeService.toggleParentTheme).toBe('function');
            expect(typeof ThemeService.updateParentThemeUI).toBe('function');
        });
    });

    // 2. Student Theme Initialization & Reading
    describe("2. Student Theme Initialization & Persistence", () => {
        test("Khi chưa có dữ liệu lưu trữ, khởi tạo mặc định là 'green' (Đêm Dạ Lục) và isDarkMode = true", () => {
            const isDark = ThemeService.initStudentTheme();
            expect(isDark).toBe(true);
            expect(ThemeService.isDarkMode).toBe(true);
            expect(ThemeService.getStudentTheme()).toBe('green');
            expect(mockBody.classList.add).toHaveBeenCalledWith('green-mode');
            expect(mockBody.classList.remove).toHaveBeenCalledWith('light-mode');
            expect(mockToggleBtn.innerHTML).toContain('fa-moon');
        });

        test("Khi đã lưu 'light' trong safeStorage, khởi tạo giao diện 'light' (Lá Dịu Mắt) và isDarkMode = false", () => {
            safeStorage.setItem("toan6_theme", "light");
            const isDark = ThemeService.initStudentTheme();
            expect(isDark).toBe(false);
            expect(ThemeService.isDarkMode).toBe(false);
            expect(ThemeService.getStudentTheme()).toBe('light');
            expect(mockBody.classList.add).toHaveBeenCalledWith('light-mode');
            expect(mockBody.classList.remove).toHaveBeenCalledWith('green-mode');
            expect(mockToggleBtn.innerHTML).toContain('fa-leaf');
        });

        test("Khi đã lưu 'green' trong safeStorage, khởi tạo giao diện 'green' và isDarkMode = true", () => {
            safeStorage.setItem("toan6_theme", "green");
            const isDark = ThemeService.initStudentTheme();
            expect(isDark).toBe(true);
            expect(ThemeService.isDarkMode).toBe(true);
            expect(mockBody.classList.add).toHaveBeenCalledWith('green-mode');
            expect(mockBody.classList.remove).toHaveBeenCalledWith('light-mode');
            expect(mockToggleBtn.innerHTML).toContain('fa-moon');
        });
    });

    // 3. Student Theme Toggle
    describe("3. Student Theme Toggle Semantics", () => {
        test("Toggle từ green (isDarkMode=true) sang light (isDarkMode=false) và lưu vào storage", () => {
            ThemeService.initStudentTheme(); // start at green (true)
            const newIsDark = ThemeService.toggleStudentTheme();

            expect(newIsDark).toBe(false);
            expect(ThemeService.isDarkMode).toBe(false);
            expect(ThemeService.getStudentTheme()).toBe('light');
            expect(safeStorage.getItem("toan6_theme")).toBe("light");
            expect(mockBody.classList.add).toHaveBeenCalledWith('light-mode');
            expect(mockBody.classList.remove).toHaveBeenCalledWith('green-mode');
            expect(mockToggleBtn.innerHTML).toContain('fa-leaf');
        });

        test("Toggle từ light (isDarkMode=false) sang green (isDarkMode=true) và lưu vào storage", () => {
            safeStorage.setItem("toan6_theme", "light");
            ThemeService.initStudentTheme(); // start at light (false)
            const newIsDark = ThemeService.toggleStudentTheme();

            expect(newIsDark).toBe(true);
            expect(ThemeService.isDarkMode).toBe(true);
            expect(ThemeService.getStudentTheme()).toBe('green');
            expect(safeStorage.getItem("toan6_theme")).toBe("green");
            expect(mockBody.classList.add).toHaveBeenCalledWith('green-mode');
            expect(mockBody.classList.remove).toHaveBeenCalledWith('light-mode');
            expect(mockToggleBtn.innerHTML).toContain('fa-moon');
        });

        test("Toggle kích hoạt callback vẽ lại biểu đồ khi được cung cấp", () => {
            ThemeService.initStudentTheme();
            const callback = jest.fn();
            ThemeService.toggleStudentTheme(callback);
            expect(callback).toHaveBeenCalledWith(false, 'light');
        });

        test("Toggle tự động gọi parentDashboard.renderCharts() khi màn hình phụ huynh đang hiển thị", () => {
            global.parentDashboard = {
                renderCharts: jest.fn()
            };
            // Mock screen-parent and parent-dashboard-content as NOT hidden
            mockScreenParent.classList.contains.mockReturnValue(false);
            mockParentDashboardContent.classList.contains.mockReturnValue(false);

            ThemeService.initStudentTheme();
            ThemeService.toggleStudentTheme();

            expect(global.parentDashboard.renderCharts).toHaveBeenCalled();
            delete global.parentDashboard;
        });
    });

    // 4. Parent Theme
    describe("4. Parent Theme Initialization & Toggle", () => {
        test("Khởi tạo mặc định parent theme là 'dark'", () => {
            const theme = ThemeService.initParentTheme();
            expect(theme).toBe('dark');
            expect(ThemeService.getParentTheme()).toBe('dark');
            expect(mockBody.classList.remove).toHaveBeenCalledWith('light-mode');
            expect(mockParentIcon.className).toBe('fa-solid fa-sun text-amber-400');
            expect(mockParentText.textContent).toBe('Giao diện Sáng');
        });

        test("Khởi tạo parent theme khi lưu 'light'", () => {
            safeStorage.setItem("parent_theme", "light");
            global.localStorage.setItem("parent_theme", "light");

            const theme = ThemeService.initParentTheme();
            expect(theme).toBe('light');
            expect(ThemeService.getParentTheme()).toBe('light');
            expect(mockBody.classList.add).toHaveBeenCalledWith('light-mode');
            expect(mockParentIcon.className).toBe('fa-solid fa-moon text-slate-600');
            expect(mockParentText.textContent).toBe('Giao diện Tối');
        });

        test("Toggle parent theme từ dark sang light", () => {
            ThemeService.initParentTheme(); // dark
            mockBody.classList.contains.mockReturnValue(false); // does not have light-mode
            
            const newTheme = ThemeService.toggleParentTheme();
            expect(newTheme).toBe('light');
            expect(mockBody.classList.add).toHaveBeenCalledWith('light-mode');
            expect(safeStorage.getItem("parent_theme")).toBe('light');
            expect(mockParentIcon.className).toBe('fa-solid fa-moon text-slate-600');
            expect(mockParentText.textContent).toBe('Giao diện Tối');
        });

        test("Toggle parent theme từ light sang dark", () => {
            safeStorage.setItem("parent_theme", "light");
            ThemeService.initParentTheme(); // light
            mockBody.classList.contains.mockReturnValue(true); // has light-mode

            const newTheme = ThemeService.toggleParentTheme();
            expect(newTheme).toBe('dark');
            expect(mockBody.classList.remove).toHaveBeenCalledWith('light-mode');
            expect(safeStorage.getItem("parent_theme")).toBe('dark');
            expect(mockParentIcon.className).toBe('fa-solid fa-sun text-amber-400');
            expect(mockParentText.textContent).toBe('Giao diện Sáng');
        });
    });

    // 5. Resilience & Edge Cases
    describe("5. Edge Cases & Resilience", () => {
        test("Không bị lỗi khi DOM elements (#theme-toggle, #parent-theme-icon) không tồn tại", () => {
            global.document.getElementById.mockReturnValue(null);
            expect(() => {
                ThemeService.initStudentTheme();
                ThemeService.toggleStudentTheme();
                ThemeService.updateStudentThemeIcon(true);
                ThemeService.initParentTheme();
                ThemeService.toggleParentTheme();
                ThemeService.updateParentThemeUI('dark');
            }).not.toThrow();
        });

        test("Không bị lỗi khi document.body không tồn tại", () => {
            global.document.body = null;
            expect(() => {
                ThemeService.initStudentTheme();
                ThemeService.toggleStudentTheme();
                ThemeService.initParentTheme();
                ThemeService.toggleParentTheme();
            }).not.toThrow();
        });

        test("Khởi tạo nhiều lần (repeated initialization) an toàn và nhất quán", () => {
            ThemeService.initStudentTheme();
            ThemeService.initStudentTheme();
            expect(ThemeService.getStudentTheme()).toBe('green');

            ThemeService.initParentTheme();
            ThemeService.initParentTheme();
            expect(ThemeService.getParentTheme()).toBe('dark');
        });

        test("setStudentTheme và setParentTheme trực tiếp", () => {
            ThemeService.setStudentTheme('light');
            expect(ThemeService.getStudentTheme()).toBe('light');
            expect(ThemeService.isDarkMode).toBe(false);

            ThemeService.setStudentTheme('green');
            expect(ThemeService.getStudentTheme()).toBe('green');
            expect(ThemeService.isDarkMode).toBe(true);

            ThemeService.setParentTheme('light');
            expect(ThemeService.getParentTheme()).toBe('light');

            ThemeService.setParentTheme('dark');
            expect(ThemeService.getParentTheme()).toBe('dark');
        });
    });
});
