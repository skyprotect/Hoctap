/**
 * HOCTAP PWA SERVICE WORKER (v13.50)
 * Network-First cho Local-First / Kiosk Server (luôn lấy mã nguồn mới nhất từ disk)
 * Tự động Fallback về Cache khi hoàn toàn mất kết nối mạng.
 */

const CACHE_VERSION = 'v13.50';
const CACHE_NAME = `hoctap-cache-${CACHE_VERSION}`;

const PRECACHE_ASSETS = [
    '/',
    '/student.html',
    '/parent.html',
    '/css/style.css',
    '/js/app.js'
];

// 1. Install Event: Nạp trước các static assets cốt lõi và bỏ qua chờ
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_ASSETS).catch((err) => {
                console.warn('[SW] Precache optional warning:', err);
            });
        })
    );
});

// 2. Activate Event: Xóa sạch 100% các phiên bản cache cũ
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('[SW] Xóa cache cũ:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. Fetch Event: Chiến lược Network-First (ưu tiên mạng/máy chủ cục bộ, fallback cache khi offline)
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // Bỏ qua các phương thức không phải GET hoặc extension
    if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
        return;
    }

    // Network-First cho TẤT CẢ requests để đảm bảo luôn nhận được HTML/CSS/JS mới nhất từ disk cục bộ
    event.respondWith(
        fetch(request)
            .then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const clone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                }
                return networkResponse;
            })
            .catch(() => {
                // Khi mất kết nối (Offline thực sự), lấy từ Cache
                return caches.match(request).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse;
                    if (url.pathname.startsWith('/api/')) {
                        return new Response(JSON.stringify({ 
                            success: false, 
                            error: 'Offline Mode: Kết nối máy chủ gián đoạn.',
                            offline: true 
                        }), {
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }
                    if (request.mode === 'navigate') {
                        return caches.match('/student.html');
                    }
                    return null;
                });
            })
    );
});
