/* RIXSTO service worker — keeps the site fast & installable.
   Safety rules: never touches /admin (CMS), never touches other origins
   (affiliate links, CDNs), product data and pages are network-first so
   deals are always fresh. */
var CACHE = "rixsto-v1";

self.addEventListener("install", function (e) { self.skipWaiting(); });

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return;          // affiliate links, CDNs: untouched
  if (url.pathname.indexOf("/admin") === 0) return;    // CMS: untouched

  // pages & product data: network first, cache fallback (always fresh deals)
  if (e.request.mode === "navigate" || url.pathname.indexOf("/products/") === 0) {
    e.respondWith(
      fetch(e.request).then(function (r) {
        var copy = r.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        return r;
      }).catch(function () { return caches.match(e.request); })
    );
    return;
  }

  // static assets (images, css): cache first, refresh in background
  e.respondWith(
    caches.match(e.request).then(function (cached) {
      var net = fetch(e.request).then(function (r) {
        var copy = r.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        return r;
      }).catch(function () { return cached; });
      return cached || net;
    })
  );
});
