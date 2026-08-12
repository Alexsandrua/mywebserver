"use strict"

//const { createClient } = require("redis");
//require('dotenv').config();

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

    async saveK(token, value) {
        await this.initR.hSet(this.redisSchem[0], token, value);
    }

    async getToken(token) {
        return await this.initR.hGet(token.redisSchem[0], token);
    }

    async getName(token) {
        return await this.initR.hGet(token.redisSchem[0], token);
    }
}


//export default new wRedis();