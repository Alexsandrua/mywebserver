
"use strict"

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { createClient } from "redis";
import jwt from 'jsonwebtoken';
import app from "../http/index.js";
import { saveTempKomira, matchName } from "./service/action.js";
import "dotenv/config";


app.initServer();

let punchCard = {};

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With',
  'Access-Control-Max-Age': 86400,
};





app.get('searchname', async (req, res) => {
  const name = req.query['search'];
  const seachRes = [];
  const seachRes0 = await matchName(decodeURIComponent(name));
  if (seachRes0) seachRes.push(seachRes0);
  const seachRes1 = await matchName(`_${decodeURIComponent(name)}`);
  if (seachRes1) seachRes.push(seachRes1);


  res.setHeader('Content-Type', 'application/json');
  try {

    if (seachRes.length) {
      res.writeHead(200, headers)
        .end(JSON.stringify({ message: 'Дані присутні', name: seachRes }));
    } else {
      res.writeHead(204, headers)
        .end(JSON.stringify({ message: 'Дані відсутні', name: false }));
    }
  } catch (e) {
    console.error(e);
  }
});

app.get('actionwrite', async (req, res) => {
  const name = req.query['search'];
  
  const seachRes = await matchName(decodeURIComponent(name));

  res.setHeader('Content-Type', 'application/json');
  try {

    if (seachRes) {
      res.writeHead(200, headers)
        .end(JSON.stringify({ message: 'Дані присутні', name: seachRes }));
    } else {
      res.writeHead(204, headers)
        .end(JSON.stringify({ message: 'Дані відсутні', name: false }));
    }
  } catch (e) {
    console.error(e);
  }
});

app.post('datastor', async (req, res) => {

  await req.getBody(async (data) => {
    await saveTempKomira(data);
  });
  res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
  res.end('ok');
});
