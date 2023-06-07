const mongoose = require("mongoose");

mongoose.connect("mongodb://0.0.0.0:27017/TutorHunt" , {
}).then(()=>{
    console.log("Connection with mongoDB is successfull !");
}).catch((error)=>{
    console.log("Connection with mongoDB has error ! " + error);
})