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
        try {
            return await this.initR.set(`${this.redisSchem[0]}${token}`, value, {
                EX: 3600,
            });
        } catch (e) {
            console.error(e);
        }
    }

    async getTempKomirka(token) {
        try {
            return await this.initR.get(`${this.redisSchem[0]}${token}`);
        } catch (e) {
            console.error(e);
        }
    }

    async getName(name) {
        try {
            return await this.initR.get(`${this.redisSchem[1]}${name}`);
        } catch (e) {
            console.error(e);
        }
    }

    async saveKomirka(name, _id) {
        //const timeDate = new Date().getTime();
        try {
            return await this.initR.set(`${this.redisSchem[1]}${name}`, _id, {
                EX: 3600,
                NX: true,
            });
        } catch (e) {
            console.error(e);
        }
    }
}


//export default new wRedis();