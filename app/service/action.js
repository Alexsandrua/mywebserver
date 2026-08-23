"use strict"

//const {redisClient} = require("../db/redisStor");
import { wRedis } from "../db/redisStor.js";
import "dotenv/config";

const redisService = new wRedis()
redisService.initRedis();
await redisService.initR.connect();

// збереження нової комірки 
export async function saveTempKomira(data) {
    const datajson = JSON.parse(data);
    console.log(datajson.token);
    await redisService.saveTempKomirka(datajson.token, JSON.stringify(datajson.data));
}

// пошук співпадінь по назві
export async function matchName(name) { 
    return await redisService.getName(name);
}

export async function saveLeterKomira(data) {
    const datajson = JSON.parse(data);
    console.log(datajson.token);
    const metaData = await redisService.getTempKomirka(datajson.token);
    console.log(' META DATA ', metaData)
    //await redisService.saveKomirka(metaData);
}