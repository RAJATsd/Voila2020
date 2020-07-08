const testMOdel = require('./models/testing');
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true})
.then(result=>{
    
    testMOdel.findOne({datings:'2020-09-23'})
    .then(result=>{
         console.log(result);
         if(!result.interest)
         console.log('ni h isme');
        // if(!result[0].interest.length){
        //     console.log('h hi ni');
        // }
        // else{
        //     console.log('h bhyi isme to')
        // }
    })
    .catch(e=>console.log(e));
    //const ntest = new testMOdel({
    //     datings:'2020-09-23'
    // });
    
    // ntest.save()
    // .then(result=>{
    //     console.log(result);
    // })
    // .catch(er=>console.log(er));
    
})
.catch(err=>{
    console.log(err);
});

