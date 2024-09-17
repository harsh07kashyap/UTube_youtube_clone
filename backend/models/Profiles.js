const mongoose=require("mongoose")
const  { Schema } = mongoose;

const ProfileSchema=new Schema({
    user: {type:mongoose.Schema.Types.ObjectId,ref:"User"},
    filename: String,
    path: String,
    originalname: String,
});

module.exports=mongoose.model("profiles",ProfileSchema)