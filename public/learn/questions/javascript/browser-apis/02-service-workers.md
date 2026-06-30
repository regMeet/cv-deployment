# Service Workers — offline & caching strategies

> A Service Worker is a script that runs in the background, acts as a network proxy, and enables offline experiences and push notifications.

## What makes it different

| Feature | Web Worker | Service Worker |
|---|---|---|
| Purpose | CPU compute | Network proxy + offline |
| Lifetime | Page lifetime | Persists across page closes |
| DOM access | No | No |
| Network intercept | No | Yes (`fetch` event) |
| Pages served | One page | All pages on same origin |

## Lifecycle

```
register → install → activate → idle → fetch/push/sync events
```

1. **Register** — page registers the SW file.
2. **Install** — SW downloads and caches assets (pre-cache).
3. **Activate** — old SW is replaced; clean up old caches here.
4. **Idle** — waits for network events.

```js
// page (main thread)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('SW registered', reg.scope))
    .catch(err => console.error('SW failed', err));
}
```

## The fetch event — intercepting network requests

```js
// sw.js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});
```

## Caching strategies

### Cache First (offline-first)
Serve from cache, fall back to network. Fast, works offline. Risk: stale content.

```js
event.respondWith(
  caches.match(event.request).then(r => r || fetch(event.request))
);
```
Use for: static assets (CSS, JS, images).

### Network First (freshness-first)
Try network, fall back to cache. Always fresh when online. Risk: slow on poor connectivity.

```js
event.respondWith(
  fetch(event.request).catch(() => caches.match(event.request))
);
```
Use for: API responses, HTML pages.

### Stale While Revalidate
Serve cache immediately, update cache in background. Fast + eventually fresh.

```js
event.respondWith(
  caches.open('v1').then(cache => {
    return cache.match(event.request).then(cached => {
      const networkFetch = fetch(event.request).then(res => {
        cache.put(event.request, res.clone());
        return res;
      });
      return cached || networkFetch;
    });
  })
);
```
Use for: non-critical assets that should feel fast but stay updated.

## Pre-caching at install time

```js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then(cache =>
      cache.addAll(['/index.html', '/app.js', '/styles.css'])
    )
  );
});
```

## Activate — clean up old caches

```js
self.addEventListener('activate', (event) => {
  const allowed = ['v2'];
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => !allowed.includes(k)).map(k => caches.delete(k)))
    )
  );
});
```

## Senior follow-ups

- **"How do you update a Service Worker?"** The browser checks for a byte-different `sw.js` on every page load. New SW installs but waits until all tabs using the old SW close, then activates. `self.skipWaiting()` + `clients.claim()` force immediate takeover.
- **"What are the security requirements?"** Service Workers require **HTTPS** (or `localhost` for dev). They can intercept all network requests, so the origin must be trusted.
- **"What's the difference between caches.match and fetch for cached responses?"** `caches.match` returns a clone of the stored Response. You must clone it (`res.clone()`) before putting it in the cache AND using it, since Response bodies are single-use streams.
