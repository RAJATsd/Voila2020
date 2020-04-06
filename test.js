// //const express = require('express');
// const mongoose = require('mongoose');
// const dateModel = require('./models/testModel');

// const a = ["cjaisidsa","hausdjasd","baiasdsasdhsa","oniasdba"];

// mongoose.connect('mongodb://localhost:27017/testingDB',{useNewUrlParser:true})
// .then(result=>{
//     new dateModel({
//         interests : a
//     }).save()
//     .then(result => {
//         console.log(result);
//     });
// })
// .catch(err=>{
//     console.log(err);
// });


// // const app = express();

// // const 


// // app.listen(4848,()=>{
// //     console.log(connected);
// // });
const obj= {
	"name" : "Rajat",
	"phoneNumber":"8765423412",
	"gender":"Male",
	"password":"password123",
	"dob":"1998-05-12",
	"email":"asdfg@gmail.com",
	"address":"aisdhisad asihdiasd asidhiasd",
	"experience":{"work":["asd","fgh","juh"],"startYear":["1992","1233","123123"],"duration":["2","3","4"],"profile":["buasd","niusahd","bkcsd"]},
	"peopleLimit":"3",
	"perHeadCharge":"200",
	"perDayCharge":"2000",
	"aadhaarNumber":"12361236",
	"interests":["asbdhasd","dgsaid","djasgdasd"],
	"languages":["dgasd","biasuhd","dgiasd"],
	"city" : "kasjdb",
	"state" : "hdasidh"
};
console.log(JSON.stringify({
	"name" : "Rajat",
	"phoneNumber":"8765423412",
	"gender":"Male",
	"password":"password123",
	"dob":"1998-05-12",
	"email":"asdfg@gmail.com",
	"address":"aisdhisad asihdiasd asidhiasd",
	"experience":{"work":["asd","fgh","juh"],"startYear":["1992","1233","123123"],"duration":["2","3","4"],"profile":["buasd","niusahd","bkcsd"]},
	"peopleLimit":"3",
	"perHeadCharge":"200",
	"perDayCharge":"2000",
	"aadhaarNumber":"12361236",
	"interests":["asbdhasd","dgsaid","djasgdasd"],
	"languages":["dgasd","biasuhd","dgiasd"],
	"city" : "kasjdb",
	"state" : "hdasidh"
}));
