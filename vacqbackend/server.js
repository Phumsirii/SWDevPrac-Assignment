const express = require('express');
const dotenv = require('dotenv');
const cookieParser=require('cookie-parser');
const connectDB=require('./config/db');

dotenv.config({path:'./config/config.env'});

connectDB();

const cors=require('cors');
const app=express();
app.use(cors());

//Body Parser
app.use(express.json());

//Cookie Parser
app.use(cookieParser());

//Route files
const hospitals = require('./routes/hospitals');
const appointments=require('./routes/appointments');

const auth = require('./routes/auth');

//Mount routers
app.use('/api/v1/hospitals',hospitals);
app.use('/api/v1/auth',auth);
app.use('/api/v1/appointments',appointments);

const PORT = process.env.PORT || 5000;
const server=app.listen(PORT,console.log('Server running in ',process.env.NODE_ENV,' mode on port ',PORT));

process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error:${err.message}`);
    server.close(()=>process.exit(1));
});