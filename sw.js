// Service Worker per Newar Records - Ottimizzazione Performance
const CACHE_NAME = 'newar-records-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/cookie.html',
    '/style.css',
    '/script.js',
    '/img/image.png',
    '/img/andrea.png',
    '/img/luca.png',
    '/img/susanna.png',
    '/img/placeholder-600x400.svg',
    '/img/service-audio.jpg',
    '/img/service-dj.jpg',
    '/img/service-eventi.jpg',
    '/img/service-grafica.jpg',
    '/img/service-produzione.jpg',
    '/img/service-studio.jpg',
    'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap'
];

// Installa il service worker e mette in cache le risorse
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Cache aperta');
                return cache.addAll(urlsToCache);
            })
    );
});

// Intercetta le richieste di rete
self.addEventListener('fetch', function(event) {
    // Skip le richieste chrome-extension e non-http
    if (!event.request.url.startsWith('http')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Se la risorsa è in cache, la restituisce
                if (response) {
                    return response;
                }

                return fetch(event.request).then(
                    function(response) {
                        // Controlla se la risposta è valida
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Skip il cache per richieste esterne problematiche
                        const url = new URL(event.request.url);
                        if (url.hostname === 'via.placeholder.com') {
                            return response;
                        }

                        // Clona la risposta
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            })
                            .catch(function(error) {
                                console.log('Errore nel cache:', error);
                            });

                        return response;
                    }
                ).catch(function(error) {
                    console.log('Fetch fallito:', error);
                    // Se è un'immagine, restituisce il placeholder locale
                    const req = event.request;
                    const dest = req.destination || '';
                    if (dest === 'image' || /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(req.url)) {
                        return caches.match('/img/placeholder-600x400.svg');
                    }
                    // Altrimenti una risposta vuota per non rompere la UI
                    return new Response('', {status: 200, statusText: 'OK'});
                });
            })
    );
});

// Aggiorna il service worker
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});