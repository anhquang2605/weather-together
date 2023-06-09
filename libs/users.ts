import * as mongoDB from "mongodb";
const { MongoClient, ServerApiVersion } = require('mongodb');
const PW = process.env.MONGO_PW;
const USER = process.env.MONGO_USER;
const DB = process.env.MONGO_DB;
const uri = `mongodb+srv://${USER}:${PW}@${DB}.8lqcwfi.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
let db: mongoDB.Db;
export async function connectDB() {
    try{
        await client.connect();
        // Send a ping to confirm a successful connection
        db = await client.db(DB);  
    } catch (e) {
        console.log(e);
    }
}
//UTILS
export async function getUserIds(){//CHANGES
    try{
        await connectDB();
        const usersCollection: mongoDB.Collection = await db.collection('users');
        const ids : string[] = (await usersCollection.find({}, { projection: { _id: 1 } }).toArray()).map(obj => obj._id.toString());
        //in the future, we will have a function that retrieve user ids from the database
        //id must be string
        const paths = ids.map(theid => {
            return {
                params: {
                    id: theid
                }
            }
        });
        return  paths;
    } finally {
        await client.close();
    }
    return [];
}

export async function getUserData(id: string){
    try{
        await connectDB();
        const usersCollection: mongoDB.Collection = await db.collection('users');
        const user = await usersCollection.findOne({ _id : new mongoDB.ObjectId(id) });
        return user;
    } finally {
        await client.close();
    }
}