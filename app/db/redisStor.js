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
        return await this.initR.hGet(this.redisSchem[0], token);
    }

    async getName(name) {
        console.log('a',this.redisSchem[1],'a')
        return await this.initR.hGet(this.redisSchem[1], name);
    }
}


//export default new wRedis();