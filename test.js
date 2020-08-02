// const testMOdel = require('./models/testing');
// const mongoose = require('mongoose');
 require('dotenv').config();
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
const axios = require('axios');
geoLocationKey = process.env.GEO_REVERESE_GEO_KEY;

const data = [
    {
        name:"India Gate",
        date:"12-12-53"
    },
    {
        name:"Gateway Of India",
        date:"12-12-53"    
    },
    {
        name:"Marine Drive,Mumbai",
        date:"12-12-53"
    },
    {
        name:"Hotel,Taj",
        date:"12-12-53"
    }
]
const places = 'Gateway Of India, Marine Drive';

    let url = 'https://api.opencagedata.com/geocode/v1/json?q='+places+'&key='+geoLocationKey;
    console.log(url);
    axios.get(url)
    .then(result=>console.log(result.data.results))
    .catch(e=>console.log(e));