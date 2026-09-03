"use strict"

//const {redisClient} = require("../db/redisStor");
import { wRedis } from "../db/redisStor.js";
import { mongoWrite } from "../db/mongodb.js";
import "dotenv/config";

const redisService = new wRedis();
redisService.initRedis();
await redisService.initR.connect();

const mWrite = new mongoWrite();
await mWrite.connectMDB();
mWrite.lCollection3month();
mWrite.lCollection3day();
mWrite.lCollection1day();

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
    console.log('DATA PALOAD ', data);
    const metaData = await redisService.getTempKomirka(datajson.token);
    const mData = JSON.parse(metaData);
    const leter = {};

    if (mData.oneName && mData.secondName && mData.password) {
        leter[`_${mData.secondName}${mData.password}`] = datajson.data;
        leter[`${mData.oneName}_${mData.secondName}`] = 'edit';
        const result = await mWrite.insertLeter3month(leter);
        await redisService.saveKomirka(`_${mData.secondName}`, `${result.insertedId}`);
        const allUsers3m = await mWrite.lettersCollection3m.find({}).toArray();
        console.log("Всі користувачі в базі:", allUsers3m);


    } else if (mData.oneName && mData.secondName) {

        leter[`_${mData.secondName}`] = datajson.data;
        leter[`${mData.oneName}_${mData.secondName}`] = 'edit';
        const result = await mWrite.insertLeter3day(leter);
        await redisService.saveKomirka(`_${mData.secondName}`, `${result.insertedId}`);
        const allUsers3d = await mWrite.lettersCollection3d.find({}).toArray();
        console.log("Всі користувачі в базі:", allUsers3d);

    } else if (mData.oneName) {
        leter[mData.oneName] = datajson.data;
        const result = await mWrite.insertLeter1day(leter);
        await redisService.saveKomirka(mData.oneName, `${result.insertedId}`);
        const allUsers1 = await mWrite.lettersCollection1d.find({}).toArray();
        console.log("Всі користувачі в базі:", allUsers1);
    }
}

export async function getLeter(name, type) {
    const _id = await redisService.getName(name);

    if (type == 1) {
        return await mWrite.getLeter3day(_id);
    } else if (type == 2) {
        return await mWrite.getLeter1day(_id);
    } else if (type == 3) {
        return await mWrite.getLeter3month(_id);
    }
}