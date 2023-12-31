import express from "express";
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoute from './routes/auth.js';
import taskRoute from './routes/task.js';
import userRoute from './routes/users.js';
import cookieParser from "cookie-parser";

mongoose.set('strictQuery', true);
const app = express();
dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

mongoose.connection.on('disconnected', () => {
    console.log('mongo disconnected');
});

mongoose.connection.on('connected', () => {
    console.log('mongo connected');
});

//middlewares
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/task', taskRoute);
app.get('/home', (req, res) => {
    res.send('EXPRESS APP RESPONSE FINALLY')
})

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

// const port = process.env.PORT || 8800;

app.listen(8800, () => {
    connect();
    console.log(`listening on 8800`);
});

export default app;