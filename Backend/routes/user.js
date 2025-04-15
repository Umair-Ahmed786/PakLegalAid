const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const { requireAuth } = require('@clerk/clerk-sdk-node');
const bodyParser = require('body-parser');
// const { Webhook } = require('svix');
// const dotenv = require('dotenv').config();



// const CLERK_WEBHOOK_SECRET = 'sk_test_qttgRKQd3sY9KYIPl4YovumEAxfuey7BcopQYHk7Gz';

//try to get more
router.post('/', bodyParser.raw({ type: 'application/json' }), async function (req, res) {
    try {

      console.log('Headers:', req.headers);
      console.log('Raw body:', req.body);

      // Extract payload data
    const payload = req.body;
    const userData = payload.data;

    const email = userData.email_addresses?.[0]?.email_address || null;
    const username = userData.username;
    const clerkUserId = userData.id;

    // Print extracted details
    console.log('Extracted User Data:');
    console.log(`Email: ${email}`);
    console.log(`Username: ${username}`);
    console.log(`Clerk User ID: ${clerkUserId}`);

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is missing in the payload' });
    }

     // Check if user already exists in the database
     const existingUser = await User.findOne({ email });
     if (existingUser) {
       console.log(`User with email ${email} already exists.`);
       return res.status(200).json({ success: true, message: 'User already exists' });
     }
 
     // Create a new user
     const newUser = new User({
       clerkUserId,
       name: username,
       email,
     });
 
     await newUser.save();
     console.log('New user created:', newUser);
 
     res.status(201).json({ success: true, message: 'User created successfully', user: newUser });
   
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
  }
}
)





//working perfectityl without Verifying
// router.post(
//   '/',
//   bodyParser.raw({ type: 'application/json' }),

//   async function (req, res) {
//     try {
//       console.log('Headers:', req.headers);
//       console.log('Raw body:', req.body);

//       const payloadString = req.body.toString('utf-8');
//       const svixHeaders = req.headers;

//       console.log('payloadString: ', payloadString);
//       console.log('svixHeaders:', svixHeaders);
//       console.log("Reached to post Request")

//       // const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY);
//       const wh = new Webhook('whsec_Rcd04KkjqxUGNPBxs1l//4SEPgfdtru+');
//       // const evt = wh.verify(req.body, req.body);
//       const evt = wh.verify(payloadString, svixHeaders);

//       // const { id, ...attributes } = evt.data;
//       const { id, first_name, last_name, username, email_addresses } = evt.data;
//       const eventType = evt.type;

//       console.log('Event type is; ',eventType)

//       if (eventType === 'user.created') {
//         console.log(`New user created:`);
//       console.log(`ID: ${id}`);
//       console.log(`Name: ${first_name} ${last_name}`);
//       console.log(`Username: ${username}`);
//       console.log(`Email: ${email_addresses?.[0]?.email_address || 'No email provided'}`);
//           console.log(`User ${id} is ${eventType}`)
//           console.log(attributes)
//       }
//       res.status(200).json({ success: true, message: 'Webhook processed successfully' });

      

//     } catch (err) {
//       res.status(400).json({
//         success: false,
//         message: err.message,
//       });
//   }
// }
// )



// Webhook endpoint 1st try

  
module.exports = router;
