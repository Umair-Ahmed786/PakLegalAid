const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const User = require('../models/User');
const Message = require('../models/Message');
const { verifyToken } = require('@clerk/backend');
// const { requireAuth } = require('@clerk/express');
const { requireAuth } = require('@clerk/clerk-sdk-node');


// Route to fetch chats for the authenticated user
router.get('/', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
  
      // Check if the Authorization header is present
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token missing or invalid' });
      }
  
      const token = authHeader.split(' ')[1]; // Extract token from the header
      
      console.log('jwt key: ',process.env.CLERK_JWT_KEY)
      // Verify the token using Clerk
      const tokenPayload = await verifyToken(token,{
        jwtKey: process.env.CLERK_JWT_KEY,
        authorizedParties: ['http://localhost:3001'], // Replace with your authorized parties
      });
      console.log('payload from token: ',tokenPayload)
      const userId = tokenPayload.sub; // Extract the user ID (sub) from the token payload
  
      console.log('Verified user ID:', userId);
  
      // Check if the user exists in the database
      const user = await User.findOne({ clerkUserId: userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Fetch chats for the user
      const userChats = await Chat.find({ userId: user.clerkUserId });
  
      // Send the chats as a response
      res.status(200).json(userChats);
    } catch (error) {
      console.error('Error fetching chats:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


// Adding chats 
router.post('/addchat', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        // Check if the Authorization header is present
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token missing or invalid' });
        }

        const token = authHeader.split(' ')[1]; // Extract token from the header

        // Verify the token using Clerk
        const tokenPayload = await verifyToken(token, {
            jwtKey: process.env.CLERK_JWT_KEY,
            authorizedParties: ['http://localhost:3001'], // Replace with your authorized parties
        });

        const userId = tokenPayload.sub; // Extract the user ID (sub) from the token payload
        console.log('Verified user ID:', userId);

        // Check if the user exists in the database
        const user = await User.findOne({ clerkUserId: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get chat data from the request body
        const { title } = req.body;

        // Create a new chat
        const newChat = new Chat({
            userId, // Link the chat to the user
            title: title || 'New Chat', // Default title if not provided
        });

        // Save the chat to the database
        await newChat.save();
        console.log(newChat);

        // Respond with the created chat
        res.status(201).json(newChat);
    } catch (error) {
        console.error('Error creating chat:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//Add chats
// router.post('/', async (req, res) => {


//     // const userId = "user_2rcIUI4ONi5MQaMwWJTu7u684Nf"

//     try {
//         const { userId, title } = req.body;
//         console.log("UserId", userId)
//         console.log("title", title)

//         const newChat = new Chat({
//             userId, // Use ObjectId here
//             title
//         });

//         const saved_chat = await newChat.save();
//         return res.json(saved_chat)


//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send('internal server error');  // Send an error response
//     }
// });

//delete chat and assosicated Messages
router.delete('/deletechat/:chatId', async (req, res) => {
    const { chatId } = req.params; // Get chatId from URL parameter

    try {
        // Step 1: Delete all messages with the given chatId
        const deletedMessages = await Message.deleteMany({ chatId });

        console.log(`Deleted ${deletedMessages.deletedCount} messages.`);

        // Step 2: Delete the chat after deleting the messages
        const deletedChat = await Chat.findByIdAndDelete(chatId);

        if (!deletedChat) {
            return res.status(404).json({ error: 'Chat not found or already deleted.' });
        }

        console.log(`Chat with chatId ${chatId} deleted.`);

        return res.status(200).json({ message: 'Chat and associated messages deleted successfully.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
});

// PUT route to update the chat title
router.put('/update/:chatId', async (req, res) => {
    const { chatId } = req.params; // Get chatId from URL params
    const { title } = req.body; // Get the new title from the request body
  
    try {
      // Authorization check
      const authHeader = req.headers.authorization;
  
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token missing or invalid' });
      }
  
      const token = authHeader.split(' ')[1]; // Extract token from the header
  
      // Verify the token using Clerk (or another JWT verification service)
      const tokenPayload = await verifyToken(token, {
        jwtKey: process.env.CLERK_JWT_KEY,
        authorizedParties: ['http://localhost:3001'], // Replace with your authorized parties
      });
  
      const userId = tokenPayload.sub; // Extract the user ID (sub) from the token payload
      console.log('Verified user ID:', userId);
  
      // Check if the user exists in the database
      // const user = await User.findOne({ clerkUserId: userId });
      // if (!user) {
      //   return res.status(404).json({ message: 'User not found' });
      // }
  
      // Find the chat by ID and check if the user is authorized to edit it
      const chat = await Chat.findById(chatId);
      if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
      }
  
      // Ensure the chat belongs to the authenticated user
      if (chat.userId !== userId) {
        return res.status(403).json({ message: 'Not authorized to edit this chat' });
      }
  
      // Update the chat title
      chat.title = title;
      await chat.save(); // Save the updated chat
  
      res.status(200).json(chat); // Return the updated chat
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  



module.exports = router;
