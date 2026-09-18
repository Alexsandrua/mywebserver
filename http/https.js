import https from 'https';
import { EventEmitter } from "events";
import fs from 'fs';
import path from 'path';

class WebServerS extends EventEmitter {
    constructor() {
        super();
        this.routes = {};

        this.sslOptions = {
            key: fs.readFileSync(new URL('../cert/key.pem', import.meta.url)),
            cert: fs.readFileSync(new URL('../cert/cert.pem', import.meta.url)),
            minVersion: 'TLSv1.2',
        };

        this.server = this.createServer();
        this.handleErrorServer()
    };
    get(urlpath, cb) {
        // Додаємо слеш на початок, якщо користувач його забув
        const formattedPath = urlpath.startsWith('/') ? urlpath : '/' + urlpath ;
        this.routes[formattedPath] = cb;
        this.routes[formattedPath + '/'] = cb;
    };

    post(urlpath, cb) {
        // Додаємо слеш на початок, якщо користувач його забув
        const formattedPath = urlpath.startsWith('/') ? urlpath : '/' + urlpath ;
        this.routes[formattedPath] = cb;
        this.routes[formattedPath + '/'] = cb;
    };

    query(req) {
        const baseURL = `https://${req.headers.host}`;
        const parsedUrl = new URL(req.url, baseURL);
        return parsedUrl.searchParams
    }
    createServer() {
        return https.createServer(this.sslOptions, (req, res) => {
            // Security headers
            res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-Frame-Options', 'SAMEORIGIN');
            res.setHeader('X-XSS-Protection', '1; mode=block');
            res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

            req.query = Object.fromEntries(this.query(req));
            const url = req.url.split('?')[0]; 
            if (this.routes[url]) {
                // Викликаємо коллбек, який ви передали в app.get()
                return this.routes[url](req, res);
            }
            
            // 2. Обробляємо маршрути (роутинг)
            if (url === '/') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                res.end('<h1>Welcome to the Secure Server</h1><p>Your connection is encrypted!</p>');
            }
            else if (url === '/api/status') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ status: 'ok', time: new Date().toISOString() }));
            }
            else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                res.end('404 Not шт Found');
            }
            this.req = req;
            this.res = res;
        });
    };

    handleErrorServer() {
        this.server.on('error', (error) => {
            console.error('Server error:', error);
        });
    };

    runHttpsServer() {
        const PORT = process.env.PORT || 3000;
        this.server.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running at https://localhost:${PORT}`);
            console.log('Press Ctrl+C to stop the server');
        });
    };
}

const app = new WebServerS();


// Тепер ви можете динамічно додавати будь-які маршрути!
app.get('test', (req, res) => {
    console.log('Отримано новий запит на /test', req.query);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Це відповідь з вашого власного методу .get()!');
});

app.get('/hello', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end('<h1>Привіт світ!</h1>');
});

app.runHttpsServer();

