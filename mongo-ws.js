
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
      const pipeline = [{
        $match: {
          'fullDocument.username': username,
          operationType: {
            $in: ['insert', 'update', 'replace']
          }
        }
      }];

      connectDB().then(async (db)  => {
        if (data.package === 'notifications'){
          const notificationCollection = await db.collection('notifications');
          
          notificationChangeStream = notificationCollection.watch(pipeline,{ fullDocument: 'updateLookup' });

          notificationChangeStream.on('change', (change) => {
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                console.log(change);
/*                 const message = {
                  type: 'notification-updated',
                  data: updated
                }
                client.send(JSON.stringify(message)); */
              }
            });
          })

        } else {
          const userCollection = await db.collection('users');
        
          userChangeStream = userCollection.watch(pipeline,{ fullDocument: 'updateLookup' });
          
          userChangeStream.on('change', (change) => {
            // Broadcast the change to all connected WebSocket clients
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                const updated = change.updateDescription.updatedFields;
                const message = {
                  type: 'user-updated',
                  data: updated
                }
                client.send(JSON.stringify(message));
              }
            });
          });
          await new Promise(() => {});
        }
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