// imports
importScripts('js/sw-utils.js');


const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    // '/',
    'index.html',
    '404.html',
    'blank.html',
    'buttons.html',
    'cards.html',
    'charts.html',
    'forgot-password.html',
    'gulpfile.js',
    'login.html',
    'register.html',
    'tables.html',
    'utilities-animation.html',
    'utilities-border.html',
    'utilities-color.html',
    'utilities-other.html',
    'js/sw-utils.js',
    'js/app.js'
];

const APP_SHELL_INMUTABLE = [
    'vendor/fontawesome-free/css/all.min.css',
    'https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i',
    'css/sb-admin-2.min.css',
    'vendor/jquery/jquery.min.js',
    'vendor/bootstrap/js/bootstrap.bundle.min.js',
    'vendor/jquery-easing/jquery.easing.min.js',
    'js/sb-admin-2.min.js',
    'vendor/chart.js/Chart.min.js',
    'js/demo/chart-area-demo.js',
    'js/demo/chart-pie-demo.js'
];

self.addEventListener('install', e => {

    const cacheStatic = caches.open( STATIC_CACHE )
        .then( cache => {
            return cache.addAll( APP_SHELL );
        });
    
    const cacheInmutable = caches.open( INMUTABLE_CACHE )
        .then( cache => {
            return cache.addAll( APP_SHELL_INMUTABLE );
        });

    e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ]) );
});

self.addEventListener('activate', e => {
    const respuesta = caches.keys().then( keys => {
        keys.forEach( key => {
            if ( key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete( key );
            }

            if ( key !== DYNAMIC_CACHE && key.includes('dynamic') ) {
                return caches.delete( key );
            }
        });
    });

    e.waitUntil( respuesta );
});

self.addEventListener('fetch', e => {

    const respuesta = caches.match( e.request ).then( res => {

        if ( res ) { // si existe la respuesta (en la cache)
            return res;
        } else {
            return fetch( e.request ).then( newRes => {
                return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes );
            });
        }

        console.log(res);
    });

    e.respondWith( respuesta );
});