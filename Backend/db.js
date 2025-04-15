
const mongoose = require('mongoose');

const ConnectToMongo = () => {
    // mongoose.connect('mongodb://127.0.0.1:27017/inotebook', {
    mongoose.connect('mongodb://127.0.0.1:27017/PakLegal', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('MongoDB Connected');
    }).catch((error) => {
        console.error('MongoDB connection error:', error);
    });
};

module.exports = ConnectToMongo;

