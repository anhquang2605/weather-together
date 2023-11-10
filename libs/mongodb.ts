import * as mongoDB from "mongodb";
const { MongoClient, ServerApiVersion } = require('mongodb');
const PW = process.env.NEXT_PUBLIC_MONGO_PW;
const USER = process.env.NEXT_PUBLIC_MONGO_USER;
const DB = process.env.NEXT_PUBLIC_MONGO_DB;
const uri = `mongodb+srv://${USER}:${PW}@${DB}.8lqcwfi.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: false,
      deprecationErrors: true,
    }
  });

let db: mongoDB.Db;
export async function connectDB() {
    try{
        if(db) return db;
        await client.connect();
        // Send a ping to confirm a successful connection
        db = await client.db(DB);  
        return db;
    } catch (e) {
        console.log(e);
    }
}