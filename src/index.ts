import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from './db';
import globalRouter from './global-router';
import { logger } from './logger';
import cors from 'cors';
import axios from 'axios';
import { set } from 'mongoose';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

connectDB();

app.use(logger);
app.use(express.json());


const url = `https://backend-cartick.onrender.com`; 
const interval = 30000; 

function reloadWebsite() {
  axios.get(url)
    .then(response => {
      console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`);
    })
    .catch(error => {
      console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
    });
}

setInterval(reloadWebsite, interval);


app.use(cors({
    origin: ['http://localhost:3000', "https://frontend-cartick.vercel.app/search"],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use('/api', globalRouter);



server.listen(PORT, () => {
    console.log(`Server runs at http://localhost:${PORT}`);
});
