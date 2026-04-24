"use strict";

const http = require("http");
const https = require("https");
const EventEmitter = require("events");
const url = require("url");

class WebServer extends EventEmitter {
  constructor() {
    super();
    this.pathReq = {};
    this.logs = {};
    this.logUp = false;
    this.index = 0;
    this.namePathReq = 'options';
    this.headers = false;
  }

  get listen() {
    console.log(' Port : ', this.listenPort || 3012);
    return this.listenPort || 3012;
  }

  set listen(listenPort) {
    return (this.listenPort = listenPort)
  }

  set log(bool) {
    this.logUp = bool
  }
  get log() {
    return this.logs
  }
  
  next = () => {
      this.index++
      this.pathReq[this.namePathReq][this.index](this.req, this.res, this.next)
    };

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

  query(req) {
    if (req.url.indexOf('?') != -1) {
      let urlQuery = req.url.slice(req.url.indexOf('?'))
      const query = {}
      urlQuery.split('&').map(line => {
        if(!line.length) return void 1
        let parValue = line.split('=')
        query[parValue[0]] = parValue[1]
      })
      return query
    } else return void 1
  }

  initServer() {
   return  http.createServer((req, res) => {
    
    
    const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With',
    'Access-Control-Max-Age': 86400, // 24 години
  };
  

   if (req.method === 'OPTIONS') {
     res.writeHead(204,  headers);
     res.end();
     return;
    }

    console.log( ' METHOD ', req.method)
         //res.writeHead(200, { 'Content-Type': 'text/plain' });

        req.query = this.query(req);
        req.getBody = this.getBody(req);

          let urlWithoutQuery = req.url.slice(1);
           
          if (req.url.indexOf('?') != -1) urlWithoutQuery = req.url.slice(1, req.url.indexOf('?'));
          let method = req.method.toLowerCase();
          this.namePathReq = req.method.toLowerCase() + urlWithoutQuery;
          console.log(this.namePathReq)
 
 
          if (Array.isArray(this.pathReq[this.namePathReq]) && typeof this.pathReq[this.namePathReq][0] == "function") {
            this.pathReq[this.namePathReq][0](req, res, this.next);
            //this.sortMethod(method, this.namePathReq, this.pathReq[this.namePathReq][0](this.req, this.res, this.next));
            if (this.logUp) {
              this.logs[Date.now()] = `method: ${req.method}, url: ${req.url}, statusCode: ${res.statusCode}, Date: ${new Date()}`;
            }
          } else if (typeof this.pathReq[this.namePathReq] == "function") {
            this.pathReq[this.namePathReq](req, res, this.next);
            //this.sortMethod(method, this.namePathReq, this.pathReq[this.namePathReq][0](this.req, this.res, this.next));
            if (this.logUp) {
              this.logs[Date.now()] = `method: ${req.method}, url: ${req.url}, statusCode: ${res.statusCode}, Date: ${new Date()}`;
            }
          } 
          
      })
      .listen(this.listen);
  }
  
  sortMethod(method, path, cb) {
    switch (method) {
            case 'get':
              this.get(path, cb);
              break;
            case 'head':
              this.head(path, cb);
              break;
            case 'post':
              this.post(path, cb);
              break;
            case 'put':
              this.put(path, cb);
              break;
            case 'delete':
              this.delete(path, cb);
              break;
            case 'connect':
              this.connect(path, cb);
              break;
            case 'options':
              this.options(path, cb);
              break;
            case 'trace':
              this.trace(path, cb);
              break;
            case 'patch':
              this.patch(path, cb);
              break;
          }
  }

  get(path, ...cb) {
    this.pathReq["get" + path] = cb
  }

  head(path, ...cb) {
    this.pathReq["head" + path] = cb
  }

  post(path, ...cb) {
    this.pathReq["post" + path] = cb
  }
  put(path, ...cb) {
    this.pathReq["put" + path] = cb
  }
  delete(path, ...cb) {
    this.pathReq["delete" + path] = cb
  }
  connect(path, ...cb) {
    this.pathReq["connect" + path] = cb
  }
  options(path, ...cb) {
    this.pathReq["options" + path] = cb;
  }
  trace(path, ...cb) {
    this.pathReq["trace" + path] = cb
  }
  patch(path, ...cb) {
    this.pathReq["patch" + path] = cb
  }
}


module.exports = new WebServer();
