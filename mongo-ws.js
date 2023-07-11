
// server.js
require('dotenv').config({ path: '.env.local' });
const express = require('express');
const next = require('next');
const WebSocket = require('ws');
const url = require('url');
const mongoose = require('mongoose');
const PORT = process.env.NEXT_PUBLIC_WS_SERVER_PORT || 3001;
const dev = process.env.NEXT_PUBLIC_NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const { MongoClient, ServerApiVersion } = require('mongodb');
const PW = process.env.NEXT_PUBLIC_MONGO_PW;
const USER = process.env.NEXT_PUBLIC_MONGO_USER;
const DB = process.env.NEXT_PUBLIC_MONGO_DB;
const uri = `mongodb+srv://${USER}:${PW}@${DB}.8lqcwfi.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });
let userChangeStream;
wss.on('connection', (socket) => {
  socket.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'username'){
      let username = data.username;
      console.log(username);
      connectDB().then(async (db)  => {
        const pipeline = [
          {
            $match:{
              'username': 'anhquang2605',//not fullDocument, wrong!!!
            }
          }
        ]
        const userCollection = await db.collection('users');
        userChangeStream = userCollection.watch(pipeline);
        userChangeStream.on('change', (change) => {
          // Broadcast the change to all connected WebSocket clients
          console.log("change");
          wss.clients.forEach((client) => {
            console.log(client.readyState)
            if (client.readyState === WebSocket.OPEN) {
              const updatedData = change.fullDocument;
              const message = {
                type: 'user',
                data: updatedData
              }
              client.send(JSON.stringify(message));
            }
          });
        });
      });
    }
  })
});

const connectDB = async () => {
  try{
      await client.connect();
      // Send a ping to confirm a successful connection
      db = await client.db(DB); 
      return db;
  } catch (e) {
      console.log(e);
  }
}
server.listen(PORT, (err) => {
  if (err) throw err;
  console.log('> Ready on http://localhost:'+PORT);
});

  //npm install --save-dev npm-run-all
  
  /*TO RUN CUSTOM SERVER AND NEXT DEV SERVER IN PARALLEL 
  "scripts": {
  "dev:next": "next dev",
  "dev:server": "node mongo-ws.js",
  "dev": "npm-run-all --parallel dev:*"
    
  */