const CACHE='ddskin-v9';
const CORE=[
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.webmanifest',
  '/assets/ddskin-logo.jpeg',
  '/assets/ddskin-header.jpg','/assets/ddskin-home-hero.jpg',
  '/assets/ddskin-offers-sprite.jpg',
  '/assets/huile-cocktail.jpg','/assets/gommage-papaye.jpg','/assets/lait-corps.jpg','/assets/creme-visage.jpg','/assets/mousse-nettoyante-visage.jpg',
  '/teint-clair.html',
  '/teint-marron.html',
  '/teint-noir.html'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(r=>{
      if(r && r.ok){
        const clone=r.clone();
        caches.open(CACHE).then(c=>c.put(e.request,clone));
      }
      return r;
    }).catch(()=>caches.match(e.request))
  );
});