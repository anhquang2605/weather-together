
// server.js
require('dotenv').config({ path: '.env.local' });
const express = require('express');
const next = require('next');
const WebSocket = require('ws');
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
let db;
let conn = 0;
const clients = {}
client.connect()
  .then((client) => {
    conn += 1;
    db = client.db(DB);
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
let connections = 0;
wss.on('connection', (socket) => {
  let userChangeStream;
  let notificationChangeStream;
  let feedsChangeStream;
  let friendsChangeStream;
  socket.on('close', () => {
      //Clean up change streams
      userChangeStream && userChangeStream.close();
      notificationChangeStream && notificationChangeStream.close();
      feedsChangeStream && feedsChangeStream.close();
      friendsChangeStream && friendsChangeStream.close();
      //Clean up clients
      delete clients[socket.username];
  })
  socket.on('message', async (message) => {
    const clientMessage = JSON.parse(message);
    if (clientMessage.username && clientMessage.username.length){
      let username = clientMessage.username;
      if(!clients[username]){
        clients[username] = socket;
        socket.username = username;
      }
      
      const pipeline = [{
        $match: {
          'fullDocument.username': username,
          operationType: {
            $in: ['insert', 'update', 'replace']
          }
        }
      }];

      if (clientMessage.type=== 'notifications-changestream'){
        const notificationCollection = await db.collection('notifications');
        
        notificationChangeStream = notificationCollection.watch(pipeline,{ fullDocument: 'updateLookup' });

        notificationChangeStream.on('change', (change) => {
          if(change.operationType === 'insert'){
            if(clients[username] && clients[username].readyState === 
              WebSocket.OPEN){
                const fullDocument = change.fullDocument;
                const message = {
                  type: 'notifications-changestream',
                  data: fullDocument
                }
                clients[username].send(JSON.stringify(message)); 
            }
          }
          
        })

      } else if(clientMessage.type === 'feeds-changestream'){
        const feedsCollection = await db.collection('feeds');
        const pipeline = [{
          $match: {
            $or:[
              {'fullDocument.username': username},
              {'fullDocument.relatedUser': username},
            ]
          } 
        }]
        feedsChangeStream = feedsCollection.watch(pipeline,{ fullDocument: 'updateLookup' });

        feedsChangeStream.on('change', (change) => {
          if(change.operationType === 'insert'){
              if(clients[username] && clients[username].readyState === 
              WebSocket.OPEN){
                const fullDocument = change.fullDocument;
                const message = {
                  type: 'feeds-changestream',
                  data: fullDocument
                }
                clients[username].send(JSON.stringify(message)); 
            }
          }
          
        })
      
      } else if(clientMessage.type === 'user-changestream'){
        const userCollection = await db.collection('users');
      
        userChangeStream = userCollection.watch(pipeline,{ fullDocument: 'updateLookup' });
        
        userChangeStream.on('change', (change) => {
          // Broadcast the change to all connected WebSocket clients
          if(change.operationType === 'update'){
            if(clients[username] && clients[username].readyState === 
              WebSocket.OPEN){
                const updated = change.updateDescription.updatedFields;
                const message = {
                  type: 'user-changestream',
                  data: updated
                }
                clients[username].send(JSON.stringify(message));
              };
          }
        });
        await new Promise(() => {});
      } else if(clientMessage.type === 'friends-changestream'){
        const friendsCollection = await db.collection('friends');
        friendsChangeStream = friendsCollection.watch(pipeline,{ fullDocument: 'updateLookup' });
        friendsChangeStream.on('change', (change) => {
          if(change.operationType === 'insert' || change.operationType === 'delete'){
            if(clients[username] && clients[username].readyState === 
              WebSocket.OPEN){
                const fullDocument = change.fullDocument;
                const message = {
                  type: 'friends-changestream',
                  data: {
                    operatonType: change.operationType,
                    friendUsername: fullDocument.friendUsername,
                  }
                }
                clients[username].send(JSON.stringify(message)); 
            }
          } 
        })
      }
      
    }
  })
});


/* // Listen for termination signals to close the MongoDB connection
process.on('exit', closeMongoConnection);
process.on('SIGINT', closeMongoConnection);
process.on('SIGTERM', closeMongoConnection);

function closeMongoConnection() {
  if (!client) {
    console.log('MongoDB connection already closed');
    return;
  }
  client.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
}
 */
server.listen(PORT, (err) => {
  if (err) throw err;
  console.log('> Ready on '+PORT);
});

  //npm install --save-dev npm-run-all
  
  /*TO RUN CUSTOM SERVER AND NEXT DEV SERVER IN PARALLEL 
  "scripts": {
  "dev:next": "next dev",
  "dev:server": "node mongo-ws.js",
  "dev": "npm-run-all --parallel dev:*"
    
  */

