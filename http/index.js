"use strict";

const http = require("http")
const https = require("https")
const EventEmitter = require("events")
const url = require("url")

module.exports = class WebServer extends EventEmitter {
  constructor() {
    super();
    this.pathReq = {}
    this.logs = {}
    this.logUp = false;
    this.index = 0
    this.next = () => {
      this.index++
      this.pathReq[this.namePathReq][this.index](this.req, this.res, this.next)
    };
  }

  get listen() {
    return this.listenPort || 3012
  }

  set listen(listenPort) {
    return (this.listenPort = listenPort)
  }
  get path() {
    return () => {
      this.url;
    }
  }
  set optionsMethod(method) {
    return [].push(method)
  }
  set log(bool) {
    this.logUp = bool
  }
  get log() {
    return this.logs
  }

  getBody(req) {
    let body = []
    return (cb) => {
      req.on('error', err => console.error(err))
      .on('data', chunck => body.push(chunck))
      .on('end', () => {
        let data = Buffer.concat(body).toString()
        this.req.body = data
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

  initServer(port) {
    if (port) this.listen = port
    http.createServer((req, res) => {
        this.req = req
        this.res = res

        this.req.query = this.query(req)
        this.req.getBody = this.getBody(req)

          let urlWithoutQuery = req.url.slice(1)
          if (req.url.indexOf('?') != -1) urlWithoutQuery = req.url.slice(1, req.url.indexOf('?'))

          this.namePathReq = req.method.toLowerCase() + urlWithoutQuery;
          if (Array.isArray(this.pathReq[this.namePathReq]) && typeof this.pathReq[this.namePathReq][0] == "function") {
            this.pathReq[this.namePathReq][0](this.req, this.res, this.next)
            if (this.logUp) {
              this.logs[Date.now()] = `method: ${req.method}, url: ${req.url}, statusCode: ${res.statusCode}, Date: ${new Date()}`
            }
          } else if (typeof this.pathReq[this.namePathReq] == "function") {
            this.pathReq[this.namePathReq](this.req, this.res, this.next)
            if (this.logUp) {
              this.logs[Date.now()] = `method: ${req.method}, url: ${req.url}, statusCode: ${res.statusCode}, Date: ${new Date()}`
            }
          }
      })
      .listen(this.listen)
  }

  get(path, ...cb) {
    this.pathReq["get" + path || "/"] = cb
  }

  head(path, ...cb) {
    this.pathReq["head" + path || "/"] = cb
  }

  post(path, ...cb) {
    this.pathReq["post" + path || "/"] = cb
  }
  put(path, ...cb) {
    this.pathReq["put" + path || "/"] = cb
  }
  delete(path, ...cb) {
    this.pathReq["delete" + path || "/"] = cb
  }
  connect(path, ...cb) {
    this.pathReq["connect" + path || "/"] = cb
  }
  options(path, ...cb) {
    this.pathReq["options" + path || "/"] = cb;
  }
  trace(path, ...cb) {
    this.pathReq["trace" + path || "/"] = cb
  }
  patch(path, ...cb) {
    this.pathReq["patch" + path || "/"] = cb
  }
}
