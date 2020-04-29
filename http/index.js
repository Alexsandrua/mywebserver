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
    this.next = () => {
      this.index++;
      this.pathReq[this.namePathReq][this.index](this.req, this.res, this.next);
    };
  }

  get listen() {
    return this.listenPort || 3012;
  }

  set listen(listenPort) {
    return (this.listenPort = listenPort);
  }
  get path() {
    return () => {
      this.url;
    };
  }
  set optionsMethod(method) {
    return [].push(method);
  }
  set log(bool) {
    this.logUp = bool;
  }
  get log() {
    return this.logs;
  }

  initServer(port) {
    if (port) this.listen = port;
    http.createServer((req, res) => {
        this.req = req;
        this.res = res;
        this.namePathReq = req.method.toLowerCase() + req.url.slice(1);
        if (typeof this.pathReq[this.namePathReq][0] == "function") {
          this.pathReq[this.namePathReq][0](this.req, this.res, this.next);
          if (this.logUp) {
            this.logs[Date.now()] = `method: ${req.method}, url: ${req.url}, statusCode: ${res.statusCode}, Date: ${new Date()}` 
          }
        }
      })
      .listen(this.listen);
  }

  get(path, ...cb) {
    this.pathReq["get" + path || "/"] = cb;
  }

  head(path, cb) {
    this.pathReq["head" + path || "/"] = cb;
  }

  post(path, cb) {
    this.pathReq["post" + path || "/"] = cb;
  }
  put(path, cb) {
    this.pathReq["put" + path || "/"] = cb;
  }
  delete(path, cb) {
    this.pathReq["delete" + path || "/"] = cb;
  }
  connect(path, cb) {
    this.pathReq["connect" + path || "/"] = cb;
  }
  options(path, cb) {
    this.pathReq["options" + path || "/"] = cb;
  }
  trace(path, cb) {
    this.pathReq["trace" + path || "/"] = cb;
  }
  patch(path, cb) {
    this.pathReq["patch" + path || "/"] = cb;
  }
}

module.exports = WebServer;
