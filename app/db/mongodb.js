"use strict"

import { MongoClient, ObjectId } from "mongodb";
import "dotenv/config";

const url = process.env.CONNECT_MONGO_DB;
const client = new MongoClient(url);

export class mongoWrite {
    constructor() {
        this.url = process.env.CONNECT_MONGO_DB;
        this.client = new MongoClient(url);
        this.db = null;
        this.lettersCollection1d = null;
        this.lettersCollection3d = null;
        this.lettersCollection3m = null;
    }

    async connectMDB(data) {

        try {
            await this.client.connect();
            console.log("✅ Успішно підключено до MongoDB!");

            this.db = client.db("post_bank");


            //const pasword_name = db.collection("pasword_name");

            //const lettersCollection = db.collection("letters");


            // Очистимо колекцію перед початком тесту (необов'язково)
            // await lettersCollection.deleteMany({});

            // const insertLerrers = await lettersCollection.insertOne({ fgg: data.letters.fgg });
            // const insertLerrers0 = await lettersCollection.insertOne({ dpp_dpp: data.letters.dpp_dpp });
            // const insertLerrers1 = await lettersCollection.insertOne({ dpp_P_dpp: data.letters.dpp_P_dpp });

            // const allUsers = await lettersCollection.find({}).toArray();
            //console.log("Всі користувачі в базі:", allUsers);

            // Перевірочний виклик (виведе список баз даних)
            // const adminDb = client.db().admin();
            // const dbs = await adminDb.listDatabases();
            // console.log("Доступні бази даних:", dbs.databases.map(d => d.Data));
        } catch (error) {
            console.error("❌ Помилка підключення:", error.message);
        }
        return this.client
    }

    lCollection1day () {
        this.lettersCollection1d = this.db.collection("letters1d");
        this.lettersCollection1d.createIndex(
            { "createdAt": 1 },
            { expireAfterSeconds: 3600 }
        );
    }

    lCollection3day () {
        this.lettersCollection3d = this.db.collection("letters3d");
        this.lettersCollection3d.createIndex(
            { "createdAt": 1 },
            { expireAfterSeconds: 3600 }
        );
    }

    lCollection3month () {
        this.lettersCollection3m = this.db.collection("letters3m")
        this.lettersCollection3m.createIndex(
            { "createdAt": 1 },
            { expireAfterSeconds: 3600 }
        );
    }

    async closeConect() {
        await this.client.close();
    }

    async insertLeter1day(data) {
        await this.lettersCollection1d.insertOne({
            ...data,
            createdAt: new Date(),
        });
    }

    async insertLeter3day(data) {
        await this.lettersCollection3d.insertOne({
            ...data,
            createdAt: new Date(),
        });
    }

    async insertLeter3month(data) {
        await this.lettersCollection3m.insertOne({
            ...data,
            createdAt: new Date(),
        });
    }
}
