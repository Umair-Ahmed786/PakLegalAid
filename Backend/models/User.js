// import mongoose from 'mongoose';
const mongoose =  require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  clerkUserId: {
    type: String, 
    required: true, 
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }

});

const User = mongoose.model('User', UserSchema);
User.createIndexes()
module.exports = User