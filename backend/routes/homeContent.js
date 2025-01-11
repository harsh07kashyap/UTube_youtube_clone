const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const User = require("../models/User");
const Videos = require("../models/Videos");
const Thumbnails = require("../models/Thumbnails");
const Profile = require("../models/Profiles");
const path = require("path");

const videosPath = path.join(__dirname, "../uploads/videos");
router.use("/uploads/videos", express.static(videosPath));

router.get("/fetchvideos/:id", async (req, res) => {
  try {
    const videoId = req.params.id;
    const video = await Videos.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    return res.status(200).json(video);
  } catch (error) {
    console.error("Error fetching video:", error);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Server Error", error: error.message });
    }
  }
});

const thumbnailsPath = path.join(__dirname, "../uploads/images");
router.use("/uploads/images", express.static(thumbnailsPath));

router.get("/fetchthumbnails", async (req, res) => {
  try {
    const thumbnails = await Thumbnails.find({}).populate({
    path: 'video',
    populate: {
      path: 'user', // Populate the user within the video
      select: 'name _id followers' // Only select the name field from the user
    }
  })
  .lean();
  const thumbnailsWithDetails = await Promise.all(thumbnails.map(async (thumbnail) => {
    const profile = await Profile.findOne({ user: thumbnail.video.user._id }).select('filename'); // Fetch profile picture path

    return {
      _id: thumbnail._id,
      filename: thumbnail.filename,
      title: thumbnail.video?.title || "No title",
      description: thumbnail.video?.description || "No description",
      videoId: thumbnail.video._id,
      views: thumbnail.views,
      channelName: thumbnail.video?.user?.name || "Unknown channel",
      userid: thumbnail.video.user._id,
      initialSubscribersCount: thumbnail.video.user.followers,
      profilePicture: profile ? profile.filename : null, // Use profile picture if it existsnn
      duration:thumbnail.video?.duration
    };
  }));

    return res.status(200).json(thumbnailsWithDetails);
  } catch (error) {
    console.error("Error fetching thumbnails:", error);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Server Error", error: error.message });
    } else {
      // Optional: log or handle the case where headers have already been sent
      console.warn("Attempted to send another response after headers were already sent.");
    }
  }
});

router.put("/updateViews/:id",fetchuser, async (req, res) => {
  try {
    const videoId = req.params.id;
    const { views } = req.body;
    const userId=req.user.id;

    const thumbnail = await Thumbnails.findOne({ video: videoId }).populate('video');
    // const userId=await Thumbnails.findOne({}).
    if (!thumbnail) {
      return res.status(404).json({ message: "Thumbnail not found" });
    }

    if (thumbnail.video.user.toString() === userId) {
      return res.status(403).json({ message: "You are not authorized to update this thumbnail" });
    }
    thumbnail.views = views;
    await thumbnail.save();

    // res.status(200).json({ message: "Views updated successfully", views: thumbnail.views });
  } catch (error) {
    console.error("Error updating views:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});



router.get('/testvideo', (req, res) => {
    res.sendFile(path.join(videosPath, '1721028446454-3fd6d531de411bdc97c0af713cd1d7a5.mp4'));
});
module.exports = router;
