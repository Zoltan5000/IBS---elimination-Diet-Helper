/* Offline support: cache the app shell; always try the network first so updates arrive. */
var CACHE = 'ibs-diet-helper-20261109a';
var SHELL = ['./', 'index.html', 'css/style.css?v=20261109a', 'js/app.js?v=20261109a', 'js/features.js?v=20261109a', 'js/fodmap-data.js?v=20261109a',
  'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'fonts/press-start-2p-latin.woff2', 'privacy.html', 'terms.html', 'consumer-health-data.html'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return; // recipe API, CDNs: straight to network
  e.respondWith(fetch(e.request).then(function (res) {
    var copy = res.clone();
    caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
    return res;
  }).catch(function () {
    return caches.match(e.request).then(function (r) { return r || caches.match('index.html'); });
  }));
});
