// import mongoose from 'mongoose';
const mongoose =  require('mongoose');
const { Schema } = mongoose;

const ChatSchema = new Schema({

    // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to User
    userId: { type: String, required: true }, // Link to User
    title: { type: String, default: 'New Chat' }, // Chat topic or title
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    
});


module.exports = mongoose.model('Chat',ChatSchema);