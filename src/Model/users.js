const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        maxLength:[15,"Name exceeeds the limit !"],
        trim:true,
        required:true
    },
    email:{
        type:String,
        unique:[true,"User with this email already exists"],
        required:true,
        trim:true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error("Mail is not valid !");
            }
        }
    },
    phone:{
        type:String,
        minLenght:10,
        maxLength:11,
        required:true,
        validate(val){
            if(!validator.isMobilePhone(val) || !validator.isNumeric(val)){
                throw new Error("Phone number is not valid !")
            }
        }
    },
    address:{
        type:String,
        maxLength:[30,"Name exceeeds the limit !"],
        trim:true,
        required:true
    },
    password:{
        type:String,
        minLength:[8,"Password is too short !"],
        validate(val){
            if(validator.isStrongPassword(val,{ minLength: 8, minLowercase: 0, minUppercase: 0, minNumbers: 1, minSymbols: 0, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0, pointsForContainingLower: 0, pointsForContainingUpper: 0, pointsForContainingNumber: 0, pointsForContainingSymbol: 0 })){
                console.log("Password is Strong !")
            }
            else{
                throw new Error("Password should contain numbers and alphabets !")
            }
        }
    },
    role:{
        type:String,
        required:[true,"Role is not selected"]
    },
    avatar:{
        type:Buffer
    },
    age:{
        type:Number,
        max:[3,"Invalid Age !"]
    },
    availability:{
        type:String
    },
    time:{
        type:String
    },
    qualification:{
        type:String
    },
    charges:{
        type:String
    },
    courses:{
        type:String
    }
    
});

const User = new mongoose.model("User",userSchema);

module.exports = User;