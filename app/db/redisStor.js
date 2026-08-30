"use strict"

import { createClient } from "redis";
import "dotenv/config";

export class wRedis {
    constructor() {
        this.initR = null;
        this.redisSchem = process.env.SHEMAREDIS.split(',');
    }
    initRedis() {

        this.initR = createClient({
            url: process.env.REDIS_URL
        });
        this.initR.on('error', (err) => console.error('Redis Client Error', err));

    }

    async saveTempKomirka(token, value) {
        await this.initR.hSet(this.redisSchem[0], token, value);
    }

    async getTempKomirka(token) {
        return await this.initR.hGet(this.redisSchem[0], token);
    }

    async getName(name) {
        return await this.initR.hGet(this.redisSchem[1], name);
    }

    async saveKomirka(name) {
        const timeDate = new Date().getTime();
        await this.initR.hSet(this.redisSchem[1], name, timeDate, {
            EX: 10,
            NX: true,
        });
    }
}


//export default new wRedis();