"use strict";

const http = require("http");
const https = require("https");
const EventEmitter = require("events");
const url = require("url");

// example option = { port : 'port', hostname:'hostname'}

class WebServer extends EventEmitter {
  constructor() {
    super();
    this.pathReq = {};
    this.logs = {};
    this.logUp = false;
    this.namePathReq = '';
    this.index = 0;
    this.next = () => {
      console.log(this.index, ' ===', this.namePathReq)
      this.index++
      this.pathReq[this.namePathReq][this.index].call(this, this.req, this.res, this.next);
    }
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
    http
      .createServer((req, res) => {
        //test
        this.namePathReq = req.method.toLowerCase() + req.url.slice(1);

        if (typeof this.pathReq[this.namePathReq][0] == "function") {
          this.req = req;
          this.res = res;
          if (this.pathReq[this.namePathReq][0].length > 2) {
            this.pathReq[this.namePathReq][0].call(this, this.req, this.res, this.next);
          } else {
            this.pathReq[this.namePathReq][0](req, res);
          }
          if (this.logUp) {
            this.logs[Date.now()] =
              "method :" +
              req.method +
              ", url: " +
              req.url +
              ", statusCode: " +
              res.statusCode +
              ", Date: " +
              new Date();
          }
        }
      })
      .listen(this.listen);
  }

  get(path, ...cb) {
    // Метод GET запитує представлення вказаного ресурсу. Запити, які використовують GET, повинні лише отримувати дані.
    this.pathReq["get" + path || "/"] = cb;
  }

  head(path, cb) {
    // Метод HEAD запитує відповідь, ідентичну запиту GET, але без тіла.
    this.pathReq["head" + path || "/"] = cb;
  }

  post(path, cb) {
    // Метод POST використовується для відправки об'єкта на вказаний ресурс, часто викликаючи зміну стану або побічних ефектів на сервері
    this.pathReq["post" + path || "/"] = cb;
  }
  put(path, cb) {
    // Метод PUT замінює всі поточні представлення цільового ресурсу на корисне навантаження, що вказане в запиті.
    this.pathReq["put" + path || "/"] = cb;
  }
  delete(path, cb) {
    // Метод DELETE видаляє вказаний ресурс.
    this.pathReq["delete" + path || "/"] = cb;
  }
  connect(path, cb) {
    // Метод CONNECT встановлює тунель до сервера, ідентифікованого цільовим ресурсом.
    this.pathReq["connect" + path || "/"] = cb;
  }
  options(path, cb) {
    // Метод OPTIONS використовується для опису варіантів зв'язку до цільового ресурсу.
    this.pathReq["options" + path || "/"] = cb;
  }
  trace(path, cb) {
    // Метод TRACE виконує тест зворотного зв'язку по шляху до цільового ресурсу.
    this.pathReq["trace" + path || "/"] = cb;
  }
  patch(path, cb) {
    // Метод PATCH використовується для застосування часткових модифікацій в ресурсі.
    this.pathReq["patch" + path || "/"] = cb;
  }
}

module.exports = WebServer
