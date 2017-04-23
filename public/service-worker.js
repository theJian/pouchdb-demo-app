const CACHE_NAME = 'contact-book-demo'

const resourcesToCache = [
  '/',
  '/css/style.css',
  '/js/vendor/pouchdb.min.js',
  '/js/register-service-worker.js',
  '/js/store.js',
  '/js/app.js'
];

// NOTE: The life-cycle of a service worker starts with installation. We can handle the install event and put all required resources in the cache
self.addEventListener('install', function(e) {
  console.log('install service worker');
  // NOTE: the waitUntil method is used to tell the browser not to terminate the service worker until the promise passed to waitUntil is either resolved or rejected.
  // see: http://stackoverflow.com/questions/37902441/what-does-event-waituntil-do-in-service-worker-and-why-is-it-needed
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(resourcesToCache);
      })
  )
});

self.addEventListener('activate', function(e) {
  console.log('service worker activated');
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request)
          .then(function(response) {
            console.log('request:', e.request);

            if (response) {
              console.log('cache hit');
              return response;
            }

            console.log('fetching');
            return fetch(e.request);
          })
  )
});
