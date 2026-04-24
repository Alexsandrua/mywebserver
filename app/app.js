
"use strict"

const redis = require("redis");
const jwt = require('jsonwebtoken');
const app =  require("../").http;


//app.listen = 3000;
app.initServer();

let punchCard = {};

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With',
    'Access-Control-Max-Age': 86400, // 24 години
  };

  // set header to handle the CORS
  //headers["Access-Control-Allow-Origin"] = "*";
  //headers["Access-Control-Allow-Methods"] = "PUT, POST, GET, DELETE, OPTIONS";
  //headers["Access-Control-Allow-Headers"] = "Content-Type, Content-Length, Authorization, Accept, X-Requested-With";
  //headers["Access-Control-Max-Age"] = "86400";
  //headers["Content-Type"] = "application/json";//,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
  //headers["Accept"] = "application/json"


async function clienteRedis() {

  return   await redis.createClient({
    url: 'redis://:EOM*191721*UNR@172.18.0.2:6379',
  }).on('error', (err) => console.error('Redis Client Error', err)).connect();
  //await client.set("key0001", "00010111");
  //const value = await client.get("key0001");
  //client.destroy();
  //console.log('data : ',value);
  //return value;

}

  const setData = async (data) =>  {
    await  clientRedis().set(data).destroy();
}

app.get('test', async (req, res) => {
let timeMilliseconds = Date.now();
const token = jwt.sign({ foo: 'bar' }, 'timeMilliseconds');
let decoded = jwt.verify(token, 'timeMilliseconds');
console.log(decoded) // bar
console.log(' RECz : ', req.query);
 res.setHeader('Content-Type', 'application/json');
console.log(punchCard[req.query['?id']]);
if(punchCard[req.query['?id']]) {
  res.writeHead(200, headers)
 .end(JSON.stringify({ message: 'Дані присутні', sesionId: req.query['?id'], punchCard: punchCard[req.query['?id']] ,  statusStoreCards: true }));
} else {
  res.writeHead(204, headers)
 .end(JSON.stringify({ message: 'Дані відсутні', sesionId: req.query['?id'],  statusStoreCards: false }));
}
  
});

app.get('data', async (req, res) => {
 //setRedis().then((v) => {
//console.log('data v : ',v);
  // });
});

app.post('setcard', async  (req, res) => {
    req.getBody((data) => {
   let d = JSON.parse(data);
   //console.log(d, ' test ');
   punchCard[d.sesionId] = d.punchCard;
  });
  res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'	 });
  res.end('ok');
});
