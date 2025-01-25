const mongoose = require('mongoose');
const mongoURL = process.env.MONGODB_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURL);
        console.log('Mongo Connected');
    } catch (error) {
        console.error('MongoDB connection error', error);
        process.exit(1);
    }
};

module.exports = connectDB;