//const express = require('express');
const mongoose = require('mongoose');
const dateModel = require('./models/testModel');

const a = ["cjaisidsa","hausdjasd","isadbkj","oniasdba"];

mongoose.connect('mongodb://localhost:27017/testingDB',{useNewUrlParser:true})
.then(result=>{
    new dateModel({
        interests :a
    }).save()
    .then(result => {
        console.log(result);
        console.log(result.interests.find((intr)=>{
            return intr==='mxkshd'
        }));
    });
})
.catch(err=>{
    console.log(err);
});


// const app = express();

// const 


// app.listen(4848,()=>{
//     console.log(connected);
// });