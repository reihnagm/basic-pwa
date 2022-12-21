var CACHE_NAME = 'my-site-cache-v1'
var urlsToCache = [
    "/",
    "fallback.json",
    "css/main.css",
    "js/main.js"
]

self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache){
            return cache.addAll(urlsToCache)
        })
    )
})

self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName != CACHE_NAME
                }).map(cacheName => {
                    return caches.delete(cacheName)
                })
            )
        })
    )
})

self.addEventListener("fetch", function(event) {
    var request = event.request
    var url = new URL(request.url)

    if(url.origin == location.origin) {
        event.respondWith(
            caches.match(request).then(function(response)  {
                return response || fetch(request)
            })
        )
    } else {
        event.respondWith(
            caches.open('blogs-cache').then(async function(cache) {
                try {
                    const liveResponse = await fetch(request)
                    cache.put(request, liveResponse.clone())
                    return liveResponse
                } catch {
                    var response = await caches.match(request)
                    if (response)
                        return response
                    return await caches.match('fallback.json')
                }
            })
        )
    }
})