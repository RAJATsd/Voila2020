const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const updationMiddleware = require('./middleware/scheduleFunc');
const cron = require('cron');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const adminRoutes = require('./routes/admin');
const authAdminRoutes = require('./routes/authAdmin');
const authGuideRoutes = require('./routes/authGuide');
const authTouristRoutes = require('./routes/authTourist');
const guideRoutes = require('./routes/guide');
const touristRoutes = require('./routes/tourist');
const messageRoutes = require('./routes/message');
const commonRoutes = require('./routes/commonRoute');
//require('dotenv').config(); //to be commented

const SERVER_PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/voila';

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'uploads')));

app.use(cors());
// app.use((req,res,next)=>{
//     res.setHeader('Access-Control-Allow-Origin','*');
//     res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,PATCH');
//     res.setHeader('Access-Control-Allow-Headers','*');
//     next();
// });


const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

require('./socket/stream')(io);
require('./socket/private')(io);
require('./socket/room')(io);
    
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/profileImages/')
    },
    filename: function (req, file, cb) {

        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            var err = new Error();
            err.code = 'filetype';
            return cb(err);
        }
        else
        {
            cb(null,new Date().toISOString()+'_'+file.originalname);
        }
    }
});
  
multer({ storage: storage }).single('profilePic');
app.use(multer({ storage: storage }).single('profilePic'));

const cronJob = cron.CronJob;
const job = new cronJob('1 0 * * *', () => {
    updationMiddleware.changeBookingStatus;
},null,true);

job.start();

app.use(adminRoutes);
app.use(authGuideRoutes);
app.use(authTouristRoutes);
app.use(guideRoutes);
app.use(touristRoutes);
app.use(messageRoutes)
app.use(commonRoutes);
app.use(authAdminRoutes);
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

server.listen(SERVER_PORT,()=>{console.log(`Server running on port ${SERVER_PORT}`)});
