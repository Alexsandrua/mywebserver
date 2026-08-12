
"use strict"

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { createClient } from "redis";
import jwt from 'jsonwebtoken';
import app from "../http/index.js";
import { getDataH } from "./service/action.js";
import "dotenv/config";


app.initServer();

let punchCard = {};

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With',
  'Access-Control-Max-Age': 86400,
};




async function clientRedis() {

  return await createClient({
    url: process.env.REDIS_URL
  })
    .on('error', (err) => console.error('Redis Client Error', err))
    .connect();
}

const setData = async (data) => {
  let c = await clientRedis();
  c.set(`${data.sesionId}`, JSON.stringify(data.punchCard));
  //c.destroy();
}

const getData = async (id) => {
  let c = await clientRedis();
  return await c.get(id);
  //c.destroy();
}

app.get('test', async (req, res) => {
  let timeMilliseconds = Date.now();
  const token = jwt.sign({ foo: 'bar' }, 'timeMilliseconds');
  let decoded = jwt.verify(token, 'timeMilliseconds');

  res.setHeader('Content-Type', 'application/json');
  try {
    let pCard = await getData(req.query['?id']);
    if (pCard) {
      res.writeHead(200, headers)
        .end(JSON.stringify({ message: 'Дані присутні', sesionId: req.query['?id'], punchCard: JSON.parse(pCard), statusStoreCards: true }));
    } else {
      res.writeHead(204, headers)
        .end(JSON.stringify({ message: 'Дані відсутні', sesionId: req.query['?id'], statusStoreCards: false }));
    }
  } catch (e) {
    console.log(e);
  }


});

app.post('datastor', async (req, res) => {

  await req.getBody(async (data) => {
    let d = JSON.parse(data);
    console.log('POST POST POST', d)
    await getDataH(d.token, JSON.stringify(d.data));
  });
  res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
  res.end('ok');
});
