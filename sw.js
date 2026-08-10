const CACHE_NAME = 'bb-admin-push-v1';
self.addEventListener('install', event => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { title: 'BB Collection', body: event.data?.text() || 'New notification' }; }
  const title = data.title || 'BB Collection';
  const options = {
    body: data.body || 'You have a new BB Collection notification.',
    icon: '/BBCollection/favicon.png',
    badge: '/BBCollection/favicon.png',
    tag: data.tag || 'bb-order',
    data: { url: data.url || '/BBCollection/admin-notifications.html' },
    vibrate: [200, 100, 200]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = event.notification.data?.url || '/BBCollection/admin-notifications.html';
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const client of list) if ('focus' in client) { client.navigate(target); return client.focus(); }
    return clients.openWindow(target);
  }));
});
