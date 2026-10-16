import https from 'https';
import { EventEmitter } from "events";
import fs from 'fs';
import path from 'path';

class WebServerS extends EventEmitter {
    constructor() {
        super();
        this.listenPort = 3012;
        this.routes = {};

        this.sslOptions = {
            key: fs.readFileSync(new URL('../cert/key.pem', import.meta.url)),
            cert: fs.readFileSync(new URL('../cert/cert.pem', import.meta.url)),
            minVersion: 'TLSv1.2',
        };

        this.server = this.createServer();
        this.handleErrorServer()
    };

    transfer(method, urlpath, cb) {
        const formattedPath = urlpath.startsWith('/') ? urlpath : '/' + urlpath;
        this.routes[method.toLowerCase() + formattedPath] = cb;
        this.routes[method.toLowerCase() + formattedPath + '/'] = cb;

    };

    get(urlpath, cb) {
        const formattedPath = urlpath.startsWith('/') ? urlpath : '/' + urlpath;
        this.routes[formattedPath] = cb;
        this.routes[formattedPath + '/'] = cb;
    };

    post(urlpath, cb) {
        // Додаємо слеш на початок, якщо користувач його забув
        const formattedPath = urlpath.startsWith('/') ? urlpath : '/' + urlpath;
        this.routes[formattedPath] = cb;
        this.routes[formattedPath + '/'] = cb;
    };

    query(req) {
        const baseURL = `https://${req.headers.host}`;
        const parsedUrl = new URL(req.url, baseURL);
        return parsedUrl.searchParams
    }

    get listen() {
        console.log(' Port : ', this.listenPort);
        return this.listenPort || 3012;
    }

    set listen(listenPort) {
        this.listenPort = listenPort;
    }

    getBody(req, cb) {
        let body = []
        return (cb) => {
            req.on('error', err => console.error(err))
                .on('data', chunck => body.push(chunck))
                .on('end', () => {
                    let data = Buffer.concat(body).toString()
                    cb(data)
                })
        }
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
            req.getBody = this.getBody(req);
            const url = req.url.split('?')[0];
            const method = req.method.toLowerCase();
            if (this.routes[url]) {
                // Викликаємо коллбек, який ви передали в app.get()
                return this.routes[url](req, res);
            }


            if (this.routes[method + url]) {
                // Викликаємо коллбек, який ви передали в transfer
                return this.routes[method + url](req, res);
            }

            //for (let i in this.routes) {}

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
        const PORT = this.listenPort;
        this.server.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running at https://localhost:${PORT}`);
            console.log('Press Ctrl+C to stop the server');
        });
    };
}

export default new WebServerS();