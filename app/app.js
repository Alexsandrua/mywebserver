
"use strict"

import jwt from 'jsonwebtoken';
import { http, https } from "../http/index.js";
import { getData, setData } from "./service/action.js"
import "dotenv/config";

https.port = process.env.PORT;
https.runHttpsServer();

const punchCard = {};

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With',
  'Access-Control-Max-Age': 86400,
};


https.transfer('GET', 'sesion', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    let pCard = await getData(req.query['id']);
    console.log('APP GET ', pCard);
    if (pCard) {
      res.writeHead(200, headers)
        .end(JSON.stringify({ message: 'Дані присутні', sesionId: req.query['id'], punchCard: JSON.parse(pCard), statusStoreCards: true }));
    } else {
      res.writeHead(204, headers)
        .end(JSON.stringify({ message: 'Дані відсутні', sesionId: req.query['id'], statusStoreCards: false }));
    }
  } catch (e) {
    console.error(e);
  }


});

https.transfer('POST', 'setcard', async (req, res) => {
  req.getBody((data) => {
    let d = JSON.parse(data);
    setData(d);
    punchCard[d.sesionId] = d.punchCard;
  });
  res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
  res.end('ok');
});

