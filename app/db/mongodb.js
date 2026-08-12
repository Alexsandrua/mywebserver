"use strict"

const { MongoClient } = require('mongodb');
require('dotenv').config();

class wMongo {
    constructor() {
        this.url = process.env.REDIS_URL;
        this.client = new MongoClient(url);
    }
}