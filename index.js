import express from "express";
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoute from './routes/auth.js';
import taskRoute from './routes/task.js';
import userRoute from './routes/users.js';
import cookieParser from "cookie-parser";
import serverless from "serverless-http";

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
    res.send('EXPRESS APP RESPONSE CIBAI')
});

app.post('/login', async(req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return next(createError(404, 'User not found!'));
        const notHashPassword = req.body.password;
    
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) return next(createError(400, 'Wrong password or email!'));
    
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT);
    
        const { password, role, ...otherDetails } = user._doc;
        res.cookie('access_token', token, {
          httpOnly: true,
        });
        
        res.status(200).json({ details: { ...otherDetails }, role, notHashPassword, password });
      } catch (err) {
        next(err);
      }
});

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

const port = CYCLIC_URL || 8800;

app.listen(port, () => {
    connect();
    console.log(`listening on 8800`);
});

export default serverless(app);