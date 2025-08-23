import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config();
import connectDB from './config/db.js';
import { clerkWebhooks } from './controllers/webhooks.js';

// Initialize express
const app=express();

// Connect to database
await connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res)=>{
    res.send('Hello world');
});
app.post('/webhooks', clerkWebhooks);

// Port
const PORT = process.env.PORT ;

app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`)
})
