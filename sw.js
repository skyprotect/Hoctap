/**
 * HOCTAP PWA SERVICE WORKER (v13.37)
 * Cung cấp khả năng chạy Offline thực sự, nạp nhanh và bộ nhớ đệm tối ưu
 */

const CACHE_VERSION = 'v13.37';
const CACHE_NAME = `hoctap-cache-${CACHE_VERSION}`;

const PRECACHE_ASSETS = [
    '/',
    '/student.html',
    '/parent.html',
    '/css/style.css',
    '/css/quiz.css',
    '/js/app.js',
    '/js/core/storage.js',
    '/js/core/event-bus.js',
    '/js/core/state.js',
    '/js/core/api-client.js',
    '/js/core/navigation.js',
    '/js/core/lazy-loader.js',
    '/js/engine/question-engine.js',
    '/js/features/katex-service.js',
    '/js/features/audio-service.js',
    '/js/features/speech-service.js',
    '/js/features/scratchpad-service.js',
    '/js/features/srs-service.js',
    '/js/features/gamification-service.js',
    '/js/features/chibi-controller.js',
    '/js/features/ui-renderer.js',
    '/js/features/quiz-manager.js',
    '/js/modules/splash.module.js',
    '/js/modules/student-select.module.js',
    '/js/modules/curriculum.module.js',
    '/js/modules/quiz-runner.module.js',
    '/js/modules/practice.module.js',
    '/js/modules/leaderboard.module.js',
    '/js/modules/settings.module.js',
    '/js/modules/vocab-monster.module.js',
    '/js/modules/skill-card.module.js',
    '/js/modules/chat.module.js',
    '/js/modules/parent-dashboard.module.js',
    '/favicon.ico',
    '/manifest.json'
];

// 1. Install Event: Nạp trước các static assets cốt lõi
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(PRECACHE_ASSETS).catch((err) => {
                    console.warn('[SW] Precache incomplete (some resources optional):', err);
                });
            })
            .then(() => self.skipWaiting())
    );
});

// 2. Activate Event: Xóa sạch các phiên bản cache cũ
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('[SW] Deleting legacy cache:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. Fetch Event: Chiến lược Cache First cho assets & Network First cho APIs
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // Bỏ qua các phương thức không phải GET hoặc extension
    if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
        return;
    }

    // A. API Requests: Network-First với fallback cache
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response && response.status === 200) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    }
                    return response;
                })
                .catch(() => {
                    return caches.match(request).then((cached) => {
                        if (cached) return cached;
                        return new Response(JSON.stringify({ 
                            success: false, 
                            error: 'Offline Mode: Kết nối máy chủ gián đoạn.',
                            offline: true 
                        }), {
                            headers: { 'Content-Type': 'application/json' }
                        });
                    });
                })
        );
        return;
    }

    // B. Static Assets, Scripts & JSON Data: Stale-While-Revalidate / Cache First
    event.respondWith(
        caches.match(request).then((cached) => {
            const fetchPromise = fetch(request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const clone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                }
                return networkResponse;
            }).catch(() => null);

            // Trả về bản cache ngay lập tức nếu có, đồng thời cập nhật cache từ network ở chế độ nền
            return cached || fetchPromise || caches.match('/student.html');
        })
    );
});
