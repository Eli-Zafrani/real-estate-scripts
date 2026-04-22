const CACHE='p3scripts-v7';
const ASSETS=['./index.html','./manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  if(e.request.url.includes('api.anthropic.com')||e.request.url.includes('fonts.googleapis'))return;
  // Network first for HTML, cache fallback for everything else
  if(e.request.url.endsWith('.html')||e.request.url.endsWith('/')){
    e.respondWith(fetch(e.request).then(r=>{
      const clone=r.clone();
      caches.open(CACHE).then(c=>c.put(e.request,clone));
      return r;
    }).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).catch(()=>caches.match('./index.html'))));
});
