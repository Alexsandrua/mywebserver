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

    //{"oneName":"jku","secondName":"","password":""}

    if (mData.oneName && mData.secondName && mData.password) {
        console.log(' FIRST 00001')
        mWrite.lCollection3month();
        await redisService.saveKomirka(`_${mData.secondName}`);

        leter[`_${mData.secondName}${mData.password}`] = datajson.data;
        leter[`${mData.oneName}_${mData.secondName}`] = 'edit';

        await mWrite.insertLeter3month(leter);
const allUsers3m = await mWrite.lettersCollection3m.find({}).toArray();
    console.log("Всі користувачі в базі:", allUsers3m);
        

    } else if (mData.oneName && mData.secondName) {
        console.log(' CECOND 00010')
        await redisService.saveKomirka(`_${mData.secondName}`);

        leter[`_${mData.secondName}`] = datajson.data;
        leter[`${mData.oneName}_${mData.secondName}`] = 'edit';
        mWrite.lCollection3day();
        await mWrite.insertLeter3day(leter);
        const allUsers3d = await mWrite.lettersCollection3d.find({}).toArray();
    console.log("Всі користувачі в базі:", allUsers3d);

    } else if (mData.oneName) {
        console.log(' THRID 00100')
        mWrite.lCollection1day();
        await redisService.saveKomirka(mData.oneName);

        leter[mData.oneName] = datajson.data;

        await mWrite.insertLeter1day(leter);
        const allUsers1 = await mWrite.lettersCollection1d.find({}).toArray();
    console.log("Всі користувачі в базі:", allUsers1);
    }

    
    
    const allUsers3m = await mWrite.lettersCollection3m.find({}).toArray();
    console.log("Всі користувачі в базі:", allUsers3m);

}