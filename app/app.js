
"use strict"

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { createClient } from "redis";
import jwt from 'jsonwebtoken';
import app from "../http/index.js";
import { saveKomira, matchName } from "./service/action.js";
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
  const seachRes = await matchName(name.trim());
  res.setHeader('Content-Type', 'application/json');
  try {

    if (true) {
      res.writeHead(200, headers)
        .end(JSON.stringify({ message: 'Дані присутні', name: seachRes }));
    } else {
      res.writeHead(204, headers)
        .end(JSON.stringify({ message: 'Дані відсутні', sesionId: req.query['?id'], statusStoreCards: false }));
    }
  } catch (e) {
    console.error(e);
  }


});

app.post('datastor', async (req, res) => {

  await req.getBody(async (data) => {
    let d = JSON.parse(data);
    console.log('POST POST POST', d)
    await saveKomira(d.token, JSON.stringify(d.data));
  });
  res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
  res.end('ok');
});
