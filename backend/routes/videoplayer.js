const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const User = require("../models/User");
const Videos = require("../models/Videos");
const Thumbnails = require("../models/Thumbnails");
const path = require("path");

router.post("/videos/:id/comment",fetchuser, async (req, res) => {
    try {
      const videoId = req.params.id;
      const { comment } = req.body; 
      const userId=req.user.id;
      const updatedVideo = await Videos.findByIdAndUpdate(
        videoId,
        {
          $push: {
            comments: {
              user: userId,  // Assuming userId is the ObjectId of the user who commented
              text: comment,
              date: new Date()  // Add the current date
            }
          }
        },
        { new: true } // Return the updated document
      );
  
      if (!updatedVideo) {
        return res.status(404).json({ message: "Video not found" });
      }
  
      return res.json(updatedVideo);
    } catch (err) {
      res.status(500).json({ message: "Error adding comment", error: err.message });
    }
  });



  router.get("/comments/:id",async(req,res)=>{
    try{
      const videoId=req.params.id;
      const video=await Videos.findById(videoId).populate('comments.user','name');
      
      if(!video){
        return res.status(404).json({message:'video not found'});
      }
      return res.json(video);
    }
    catch(err){
      res.status(500).json({message:"error fetching comments",error:err.message})
    }
  })

  router.post("/likes/:id",fetchuser,async(req,res)=>{
    try{
      const videoId=req.params.id;
      const userId=req.user.id;
      const video=await Videos.findById(videoId);
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }
      const hasLiked=video.likedBy.includes(userId);
      if(!hasLiked){
        video.likedBy.push(userId);
        video.likes+=1;
      }
      else{
        video.likedBy.pull(userId);
        video.likes-=1;
      }
      await video.save();
      return res.json({likes:video.likes,hasLiked:!hasLiked});
    }
    catch(err){
      res.status(500).json({message:"error fetching likes",error:err.message})
    }
  })

  router.get("/like_status/:id",fetchuser,async (req,res)=>{
    const videoId=req.params.id;
    const userId=req.user.id;
    const video=await Videos.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const hasLiked = video.likedBy.includes(userId); // Check if user has liked the video

    return res.json({
      hasLiked,
      likes: video.likes // Return the current like count
    });
  })

  module.exports = router;