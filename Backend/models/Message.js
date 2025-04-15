// import mongoose from 'mongoose';
const mongoose =  require('mongoose');
const { Schema } = mongoose;

const MessageSchema = new Schema({
    
    // chatId: { type: String, required: true }, // Link to Chat
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true }, // Link to Chat
    sender: { type: String, enum: ['user', 'assistant'], required: true }, // Who sent the message
    content: { type: String, required: true }, // Prompt or completion text
    createdAt: { type: Date, default: Date.now },
    
});

module.exports = mongoose.model('Message',MessageSchema );

// const Chat = mongoose.model('Chat', ChatSchema);
// User.createIndexes()
// module.exports = User
