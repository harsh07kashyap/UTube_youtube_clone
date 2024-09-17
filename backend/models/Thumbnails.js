const mongoose=require("mongoose")
const  { Schema } = mongoose;

const ThumbnailSchema=new Schema({
    video: {type:mongoose.Schema.Types.ObjectId,ref:"Video"},
    filename: String,
    path: String,
    originalname: String,
    views:{type:Number,default:0}
});

module.exports=mongoose.model("thumbnail",ThumbnailSchema)