import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static.static('public')); 
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true}));
app.use(cookieParser());

//routes import
import { userRouter } from './routes/user.routes.js';
import { chatRouter } from './routes/chat.routes.js';

//routes declaration
app.use('/api/v1/user', userRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/health', (req, res) => {
    res.status(200).send("Server is running !!");
});


export { app };