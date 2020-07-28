const multer = require('multer');

const storage = multer.memoryStorage({
    destination:function(req,file,callback){
        callback(null,'')
    }
});

module.exports = multer({storage}).single('profilePic');