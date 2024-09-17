
const mongoose=require("mongoose")
const {Schema}=mongoose;
const UserSchema=new Schema({
    name:{
        type:String, required:true
    },
    email:{
        type:String, required:true, unique:true
    },
    password:{
        type:String, required:true
    },
    date:{
        type:Date, default:Date.now
    },
    profilePicture: {
        type: String, 
        default: ""  // Default to an empty string or a default URL
    },
    followers:{
        type:Number,default:0
    },
    following:[String]
})

module.exports=mongoose.model("user",UserSchema)