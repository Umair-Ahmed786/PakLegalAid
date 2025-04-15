
const express = require('express');
const router = express.Router();
const {requireAuth} = require("@clerk/express")
const Message = require('../models/Message')
const User = require('../models/User')
const Chat = require('../models/Chat')
const { verifyToken } = require('@clerk/backend');

const { body, validationResult } = require('express-validator');


router.post('/addmessage/:chatId', async (req, res) => {
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

        const chatId = req.params.chatId;
        

        // Check if the chat exists in the database
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        // Check if the user is authorized to access this chat
        if (chat.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        const { sender, content } = req.body;

        // Create a new message
        const newMessage = new Message({
            chatId, // Link the message to the chat
            sender,
            content,
        });

        // Save the message to the database
        await newMessage.save();
        console.log('New message created:', newMessage);

        // Respond with the created message
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error creating message:', error);

        // Handle specific errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }

        res.status(500).json({ message: 'Internal server error' });
    }
});



router.get('/getmessage/:chatId', async (req, res) => {
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
        console.log('Verified user2 ID:', userId);

        const chatId = req.params.chatId;
        console.log('chat ID is : ',chatId)

        // Check if the chat exists in the database
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        console.log('found the chat with the chatId: ',chat)

        // Check if the user is authorized to access this chat
        if (chat.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }
        console.log('user Verified: ')


       //fetching all messages for the chat
       const messages = await Message.find({ chatId: chatId });
       if (!messages || messages.length === 0) {
           return res.status(404).json({ message: 'No Messages were found' });
       }

        // Respond with the created message
        res.status(201).json(messages);
    } catch (error) {
        console.error('Error creating message:', error);

        // Handle specific errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }

        res.status(500).json({ message: 'Internal server error' });
    }
});








module.exports = router;
