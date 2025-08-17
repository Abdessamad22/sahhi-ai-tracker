const CACHE_NAME = 'health-app-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// قائمة الملفات الأساسية للتخزين المؤقت
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// قائمة المسارات التي يجب تخزينها مؤقتاً
const CACHE_ROUTES = [
  '/',
  '/body-measurements',
  '/calorie-calculator',
  '/cardio-converter'
];

// تثبيت Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Install failed', error);
      })
  );
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated successfully');
        return self.clients.claim();
      })
  );
});

// اعتراض الطلبات
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // تجاهل الطلبات من خارج النطاق
  if (!url.origin.includes(self.location.origin)) {
    return;
  }

  // استراتيجية Cache First للأصول الثابتة
  if (STATIC_ASSETS.some(asset => url.pathname.includes(asset))) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          return response || fetch(request)
            .then((fetchResponse) => {
              return caches.open(STATIC_CACHE)
                .then((cache) => {
                  cache.put(request, fetchResponse.clone());
                  return fetchResponse;
                });
            });
        })
        .catch(() => {
          // إرجاع صفحة offline إذا لم تكن متوفرة
          if (request.destination === 'document') {
            return caches.match('/');
          }
        })
    );
    return;
  }

  // استراتيجية Network First للمسارات الديناميكية
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // تخزين الاستجابة الناجحة
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              cache.put(request, responseClone);
            });
          return response;
        })
        .catch(() => {
          // البحث في التخزين المؤقت إذا فشل الشبكة
          return caches.match(request)
            .then((response) => {
              return response || caches.match('/');
            });
        })
    );
    return;
  }

  // استراتيجية Cache First للموارد الأخرى
  event.respondWith(
    caches.match(request)
      .then((response) => {
        return response || fetch(request)
          .then((fetchResponse) => {
            return caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, fetchResponse.clone());
                return fetchResponse;
              });
          });
      })
      .catch(() => {
        console.log('Service Worker: Request failed and no cache available');
      })
  );
});

// التعامل مع رسائل من التطبيق الرئيسي
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// إشعار عند توفر تحديث جديد
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CHECK_UPDATE') {
    event.ports[0].postMessage({
      type: 'UPDATE_AVAILABLE',
      version: CACHE_NAME
    });
  }
});