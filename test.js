const testMOdel = require('./models/testing');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://ekuicsd:icsd@cluster0-zy7nm.mongodb.net/voila',{useNewUrlParser:true})
.then(result=>{
    

    const ntest = new testMOdel({
        datings:'2020-09-17'
    });
    
    ntest.save()
    .then(result=>{
        console.log(result);
    })
    .catch(er=>console.log(er));
    
})
.catch(err=>{
    console.log(err);
});
