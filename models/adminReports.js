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
});

module.exports = mongoose.model('report',reportSchema);