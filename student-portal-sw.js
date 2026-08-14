const STATIC_CACHE = "oquway-student-static-v1.1.231";

self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(cacheNames.filter(function (cacheName) {
        return cacheName.indexOf("oquway-student-static-") === 0 && cacheName !== STATIC_CACHE;
      }).map(function (cacheName) {
        return caches.delete(cacheName);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (!isStudentPortalAsset(request, url)) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});

function isStudentPortalAsset(request, url) {
  return url.pathname.indexOf("/apps/student-login/") !== -1
    || url.pathname.indexOf("/apps/student-dashboard/") !== -1
    || request.destination === "script"
    || request.destination === "style"
    || request.destination === "image";
}

async function networkFirst(request) {
  const cache = await caches.open(STATIC_CACHE);

  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    return (await cache.match(request)) || Response.error();
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  const refreshed = fetch(request).then(function (response) {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(function () {
    return cached;
  });

  return cached || refreshed;
}
