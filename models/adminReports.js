const mongoose = require('mongoose');

const schema = mongoose.Schema;

const reportSchema = new schema({
   name : {
       type:String,
       required:true
   },
   reporterId:{
       type:schema.Types.ObjectId,
       required:true
   },
   userType : {
       type:String,
       required:true
   },
   latitude:{
       type:Number
   },
   longitude:{
       type:Number     
   },
   status : {
       type:String,
       default:'UNRESOLVED'
   }
});

module.exports = mongoose.model('report',reportSchema);