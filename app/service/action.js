"use strict"

//const {redisClient} = require("../db/redisStor");
import { wRedis } from "../db/redisStor.js";
import "dotenv/config";

const redisService = new wRedis()
redisService.initRedis();
await redisService.initR.connect();

// збереження нової комірки 
export async function saveKomira(token, data) {
    await redisService.saveK(token, data);
}

// пошук співпадінь по назві
export async function matchName(name) {
await redisService.getName(token, data);
}