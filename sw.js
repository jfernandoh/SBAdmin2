// const CACHE_NAME = 'cache-1';
const CACHE_STATIC_NAME  = 'static-v1';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
const CACHE_INMUTABLE_NAME = 'inmutable-v1';

const CACHE_DYNAMIC_LIMIT = 50;

console.log('.......');

self.addEventListener('install', e => {
    const cacheProm = caches.open( CACHE_STATIC_NAME )
        .then( cache => {
            return cache.addAll([ 
                '/index.html',
                '/login.html'
            ]);

        
        });
    
        console.log(cacheProm);

    const cacheInmutable = caches.open( CACHE_INMUTABLE_NAME )
        .then( cache => cache.add('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'));
    e.waitUntil( Promise.all([cacheProm, cacheInmutable]) );
});


self.addEventListener('fetch', e => {
    // 2- Cache with Network Fallback
    const respuesta = caches.match( e.request )
        .then( res => {
            if ( res ) return res;
            // No existe el archivo
            // tengo que ir a la web
            console.log('No existe', e.request.url );
            return fetch( e.request ).then( newResp => {
                caches.open( CACHE_DYNAMIC_NAME )
                    .then( cache => {
                        cache.put( e.request, newResp );
                        // limpiarCache( CACHE_DYNAMIC_NAME, 50 );
                    });
                return newResp.clone();
            }).catch( err => {
                if ( e.request.headers.get('accept').includes('text/html') ) {
                    return caches.match('/pages/offline.html');
                }
            });
        });
    e.respondWith( respuesta );
});