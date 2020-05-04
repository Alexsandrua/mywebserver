"use strict";
const WebServer = require("../").http;

let app = new WebServer();
app.initServer();

app.options("", (req, res) => {
  var headers = {};

  // set header to handle the CORS
  headers["Access-Control-Allow-Origin"] = "*";
  headers["Access-Control-Allow-Headers"] =
    "Content-Type, Content-Length, Authorization, Accept, X-Requested-With";
  headers["Access-Contrl-Allow-Methods"] = "PUT, POST, GET, DELETE, OPTIONS";
  headers["Access-Control-Max-Age"] = "86400";
  res.writeHead(200, headers);
  res.end();
});
// The intermediate data processing or middleware
app.get(
  "test",
  (req, res, next) => {
    console.log("testNext", req.method, req.url);
    console.log(app.log);
    next();
  },
  (req, res, next) => {
    console.log("testNext2", req.method, req.url);
    console.log(app.log);
    next();
  },
  (req, res) => {
    console.log("testGet", req.method, req.url);
    console.log(app.log);
    res.write("hi \n");
    res.end();
  }
);

app.get("te", (req, res) => {
  console.log("testGet", req.method, req.url);
  console.log(app.log);
  res.write("hi \n");
  res.end();
});
