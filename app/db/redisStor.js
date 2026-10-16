"use strict"

import { createClient } from "redis";
import "dotenv/config";
// await c.get(id);
// c.set(`${data.sesionId}`, JSON.stringify(data.punchCard));
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

    async seveSession(id, value) {
            await this.initR.set(`${id}`, value, {
            EX: 3600,
        });
    }

    async getTempKomirka(token) {
        return await this.initR.get(`${this.redisSchem[0]}${token}`);
    }

    async getSession(id) {
        return await this.initR.get(`${id}`);
    }

    async saveKomirka(name, _id) {
        //const timeDate = new Date().getTime();
        await this.initR.set(`${this.redisSchem[1]}${name}`, _id, {
            EX: 3600,
            NX: true,
        });
    }
}


//export default new wRedis();