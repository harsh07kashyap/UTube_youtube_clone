const mongoose=require("mongoose")
const  { Schema } = mongoose;

const VideoSchema=new Schema({
    user: {type:mongoose.Schema.Types.ObjectId,ref:"user"},
    filename: String,
    path: String,
    originalname: String,
    title:String,
    description:String,
    uploadDate: {
        type: Date, // You can use Date type as well
        default:Date.now,
    },
    likes: {
        type:Number,default:0
    },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
      comments: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // Reference to the user who commented
          text: { type: String }, // The comment text
          date: { type: Date, default: Date.now }, // Date of the comment
        }
      ], 
      duration: {
        type: String, 
        required: true,
      },
});

module.exports=mongoose.model("Video",VideoSchema)