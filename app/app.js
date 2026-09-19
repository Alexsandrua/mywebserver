
"use strict"

import jwt from 'jsonwebtoken';
import app from "../http/index.js";
import { saveTempKomira, matchName, saveLeterKomira, getLeter } from "./service/action.js";
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
  const name = req.query.get('search'); //req.query['search'];
  const seachRes = [];
  let result = await matchName(decodeURIComponent(name));
  if (result) seachRes.push({ 'oneName': name });
  result = await matchName(decodeURIComponent(`_${name}`));
  if (result) seachRes.push({ 'secondName': name });

  res.setHeader('Content-Type', 'application/json');
  try {
    if (seachRes.length) {
      res.writeHead(200, headers)
        .end(JSON.stringify({ message: 'Дані присутні', names: seachRes }));
    } else {
      res.writeHead(204, headers)
        .end(JSON.stringify({ message: 'Дані відсутні' }));
    }
  } catch (e) {
    console.error(e);
  }
});

app.get('actionwrite', async (req, res) => {
  const oneName = req.query.get('oneName');
  const secondName = req.query.get('secondName');

  const resultOne = oneName ? await matchName(decodeURIComponent(oneName)) : null;
  const resultSecond = secondName ? await matchName(decodeURIComponent(secondName)) : null;

  res.setHeader('Content-Type', 'application/json');
  try {
    if (resultOne || resultSecond) {
      res.writeHead(200, headers)
        .end(JSON.stringify({ message: 'Дані присутні', oneName: resultOne, secondName: resultSecond }));
    } else {
      res.writeHead(204, headers)
        .end();
    }
  } catch (e) {
    console.error(e);
  }
});

app.post('create', async (req, res) => {

  await req.getBody(async (data) => {
    await saveTempKomira(data);
  });
  res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
  res.end();
});

app.post('seveleter', async (req, res) => {

  await req.getBody(async (data) => {
    await saveLeterKomira(data);
  });
  res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
  res.end();
});

app.get('getleter', async (req, res) => {
  const name = req.query.get('name');//req.query['name'];
  const type = req.query.get('type');//req.query['type'];

  const result = await getLeter(decodeURIComponent(name), type);

  res.setHeader('Content-Type', 'application/json');
  try {
    if (result) {
      res.writeHead(200, headers)
        .end(JSON.stringify({ message: 'Дані присутні', ...result }));
    } else {
      res.writeHead(204, headers)
        .end(JSON.stringify({ message: 'Дані відсутні', name: false }));
    }
  } catch (e) {
    console.error(e);
  }
});