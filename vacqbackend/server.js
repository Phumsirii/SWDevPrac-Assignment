const express = require('express');
const dotenv = require('dotenv');
const cookieParser=require('cookie-parser');
const connectDB=require('./config/db');
const mongoSanitize=require('express-mongo-sanitize');
const helmet = require('helmet');
const {xss}=require('express-xss-sanitizer');
const rateLimit=require('express-rate-limit');
const hpp=require('hpp');
const cors=require('cors');

dotenv.config({path:'./config/config.env'});

connectDB();

const app=express();

//Enable CORS
app.use(cors());

//Body Parser
app.use(express.json());

//Sanitize data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//Prevetn XSS attacks
app.use(xss());

//Rate limiting
const limiter=rateLimit({
    windowsMs:1*60*1000,
    max:100
});

//Use limiter
app.use(limiter);

//Prevent http param pollutions
app.use(hpp());

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