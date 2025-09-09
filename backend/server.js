import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config();
import connectDB from './config/db.js';
import { clerkWebhooks } from './controllers/webhooks.js';
import connectCloudinary from './config/cloudinary.js';
import companyRoutes from './routes/companyRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import userRoutes from './routes/userRoutes.js'
import {clerkMiddleware} from '@clerk/express'

// Initialize express
const app=express();

// Connect to database
await connectDB();
await connectCloudinary();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.get('/', (req, res)=>{
    res.send('Hello world');
});
app.post('/webhooks', clerkWebhooks);
app.use('/api/company', companyRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/users', userRoutes);

// Port
const PORT = process.env.PORT ;

app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`)
})
