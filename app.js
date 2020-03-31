const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const SERVER_PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/voila';


const app = express();

app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,PATCH');
    res.setHeader('Acess-Control-Allow-Headers','Content-Type,Authorization');
    next();
});

app.get('/',(req,res,next)=>{
    res.send(JSON.stringify({Hello:"Baby, welcome to my world"}));
});

mongoose.connect(MONGO_URI,{useNewUrlParser:true})
.then(result=>{
    console.log('connected to db');
})
.catch(err=>{
    console.log(err);
});

app.listen(SERVER_PORT,()=>{console.log(`Server running on port ${SERVER_PORT}`)});
