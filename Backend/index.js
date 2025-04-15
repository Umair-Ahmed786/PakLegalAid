const ConnectToMongo = require('./db')
const message = require('./routes/message')
const chat = require('./routes/chat')
const user = require('./routes/user')

const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config();
const {clerkMiddleware} = require("@clerk/express")

const bodyParser = require('body-parser');
const { Webhook } = require('svix');

ConnectToMongo()
const app = express()
const port = 3000

// middle wares
app.use(cors());
app.use(express.json());  //middleware to read request . body;
app.use('/clerk/webhook', bodyParser.raw({ type: 'application/json' }));
app.use(clerkMiddleware());



app.use('/message',message)
// Use express.raw() for the webhook route
app.use('/clerk/webhook', user);
app.use('/chat',chat)




app.listen(port,()=>{
    console.log(`Listening at ${port}`)
})
      
