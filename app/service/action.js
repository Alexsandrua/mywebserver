"use strict"

import { wRedis } from "../db/redisStor.js";
import "dotenv/config";

const redisService = new wRedis();
redisService.initRedis();
await redisService.initR.connect();

// збереження нової комірки 
export async function setData(data) {
    const datajson = data; //JSON.parse(data);
    await redisService.seveSession(datajson.sesionId, JSON.stringify(datajson.punchCard));
}

// пошук співпадінь по назві
export async function getData(name) {
    return await redisService.getSession(name);
}