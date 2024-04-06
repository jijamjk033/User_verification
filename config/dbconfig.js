const mongoose = require('mongoose');
require("dotenv").config();

// Connect to MongoDB
const dbConnection = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB}`);
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
};

module.exports = dbConnection;