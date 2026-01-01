"use strict"

const redis = require("redis");
const WebServer =  require("../").http;

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
async function setRedis() {

  const  client = await redis.createClient({
    url: 'redis://172.18.0.2:6379',
  }).on('error', (err) => console.error('Redis Client Error', err)).connect();
  await client.set("key0001", "00010111");
  const value = await client.get("key0001");
  client.destroy();
  console.log('data : ',value);
  return value;

}



app.get('test', async (req, res) => {
 setRedis().then((v) => {
console.log('data v : ',v);
});
  
});
