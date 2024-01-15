import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from './routes/auth.js';
import taskRoute from './routes/task.js';
import userRoute from './routes/users.js';
import cookieParser from "cookie-parser";
import serverless from "serverless-http";

// Load environment variables
dotenv.config();

// Create an Express application
const app = express();

// Configure mongoose to use strict queries
mongoose.set('strictQuery', true);

// Connect to MongoDB
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

// Event listeners for MongoDB connection status
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
});

// Middlewares
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/task', taskRoute);

// Example route
app.get('/home', (req, res) => {
    res.send('EXPRESS APP RESPONSE');
});

// Error handling middleware
app.use((err, req, res, next) => {
    const errStatus = err.status || 500;
    const errMessage = err.message || 'Something went wrong';
    return res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMessage,
        stack: err.stack,
    });
});

// Start the server after successful MongoDB connection
const startServer = async () => {
    try {
        await connect();
        const port = 8800;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1); // Exit the process with an error code
    }
};

// Call the startServer function
startServer();

// Export the serverless-wrapped application
export default serverless(app);