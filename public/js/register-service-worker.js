if ('serviceWorker' in navigator) {
  // NOTE: to be able to use the root of the app as a scope, the service worker script should be located in the root directory of the app.
  navigator.serviceWorker.register('/service-worker.js', {
    scope: '/'
  }).then(function() {
    console.log('succss');
  }).catch(function() {
    console.log('failed');
  })
}
