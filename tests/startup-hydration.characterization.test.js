/**
 * Startup hydration characterization.
 *
 * Keep configuration loading owned by initAppAfterLogin so startup performs
 * one config request before it begins the authoritative progress hydration.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const Module = require('module');

function loadProductionApp() {
    const source = fs.readFileSync(path.resolve(__dirname, '../js/app.js'), 'utf8');
    const appRequire = Module.createRequire(path.resolve(__dirname, '../js/app.js'));
    const document = {
        readyState: 'loading',
        addEventListener: jest.fn(),
        getElementById: jest.fn(() => null),
        querySelector: jest.fn(() => null)
    };
    const window = {
        safeStorage: { getItem: jest.fn(() => null), setItem: jest.fn(), removeItem: jest.fn() },
        location: { protocol: 'http:' },
        addEventListener: jest.fn()
    };
    const factory = new Function('window', 'document', 'fetch', 'require', 'console', `${source}; return window.app;`);
    return factory(window, document, jest.fn(), appRequire, console);
}

describe('startup hydration', () => {
    test('loads configuration once; initAppAfterLogin remains its sole startup owner', async () => {
        const app = loadProductionApp();
        app.initInstantUI = jest.fn();
        app.loadConfig = jest.fn().mockResolvedValue(undefined);
        app.initAppAfterLogin = jest.fn().mockResolvedValue(undefined);
        app.audio = { init: jest.fn() };
        app.checkUpdateAuto = jest.fn();
        app.checkGoogleSession = jest.fn().mockResolvedValue(undefined);
        app.updateNavigationButtons = jest.fn();
        app.scrollToActiveLesson = jest.fn();

        await app.init();

        expect(app.initAppAfterLogin).toHaveBeenCalledTimes(1);
        expect(app.loadConfig).not.toHaveBeenCalled();
    });
});
