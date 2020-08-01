// const testMOdel = require('./models/testing');
// const mongoose = require('mongoose');
// require('dotenv').config();
// mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true})
// .then(result=>{
//     const ntest = [{interest:null},{interest:'mone'}];
//     testMOdel.insertMany(ntest)
//     .then(res=>console.log(res))
//     .catch(e=>console.log(e));
//     // const queryTest = ['asd','zxc'];
//     // testMOdel.findByIdAndUpdate({_id:'5f155875178bac2e45d339c4'},{interest:'changed'})
//     // .then(resp=>console.log(resp))
//     // .catch(e=>console.log(e));
//     // testMOdel.updateMany({},{occupied:false})
//     // .then(asdf=>console.log('done'))
//     // .catch(er=>console.log(er));
// })
// .catch(err=>{
//     console.log(err);
// });

let abc = 'abc mki this';

console.log(abc.split(' ').join('+'));