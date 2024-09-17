const express = require("express");
const router = express.Router();
const Video = require("../models/Videos");
const fetchuser = require("../middleware/fetchuser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Thumbnail = require("../models/Thumbnails");
// const ffmpeg = require('fluent-ffmpeg');

const videoUploadDir = path.join(__dirname, "../uploads/videos");
const thumbnailUploadDir = path.join(__dirname, "../uploads/images");
if (!fs.existsSync(videoUploadDir)) fs.mkdirSync(videoUploadDir);
if (!fs.existsSync(thumbnailUploadDir)) fs.mkdirSync(thumbnailUploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath =
      file.fieldname === "thumbnail" ? thumbnailUploadDir : videoUploadDir;
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const videoFiletypes = /mp4|webm|ogg/;
  const imageFiletypes = /jpg|jpeg|png|svg/;
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype.toLowerCase();
  if (
    file.fieldname === "video" &&
    videoFiletypes.test(extname) &&
    videoFiletypes.test(mimetype)
  ) {
    cb(null, true);
  } else if (
    file.fieldname === "thumbnail" &&
    imageFiletypes.test(extname) &&
    imageFiletypes.test(mimetype)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type!"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 }, // Limit size to 100MB
  fileFilter: fileFilter,
});

router.use("/uploads/videos", express.static(videoUploadDir));
router.use("/uploads/images", express.static(thumbnailUploadDir));

router.post("/upload", fetchuser, (req, res) => {
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ])(req, res, async (err) => {
    if (err) {
      return res.status(400).send(err.message);
    }

    try {
      const videoFile = req.files.video[0];
      const thumbnailFile = req.files.thumbnail[0];

        const video = new Video({
          user: req.user.id,
          filename: videoFile.filename,
          path: videoFile.path,
          originalname: videoFile.originalname,
          title: req.body.title,
          description: req.body.description,
          uploadDate: new Date(),
          
        });
        await video.save();

        const thumbnail = new Thumbnail({
          video: video._id,
          filename: thumbnailFile.filename,
          path: thumbnailFile.path,
          originalname: thumbnailFile.originalname,
          views:0
        });
        await thumbnail.save();

        return res.json({ message: "Video and thumbnail uploaded successfully" });
  }
     catch (error) {
      console.error(error);
      return res.status(500).send("Server error");
    }
  });
});
// Get Videos for Logged-in User
router.get("/videos", fetchuser, async (req, res) => {
  const videos = await Video.find({ user: req.user.id }).lean();
  return res.json(videos);
});

router.delete("/deletepost/:id",fetchuser, async (req, res) => {
  try {
    const videoId = req.params.id;

    // Fetch the video and its corresponding thumbnail
    const video = await Video.findById(videoId);
    const thumbnail = await Thumbnail.findOne({ video: videoId });

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Delete the video file from the local filesystem
    const videoFilePath = path.join(__dirname, "../uploads/videos", video.filename);
    if (fs.existsSync(videoFilePath)) {
      fs.unlinkSync(videoFilePath);
    }

    // Delete the thumbnail file from the local filesystem
    if (thumbnail) {
      const thumbnailFilePath = path.join(__dirname, "../uploads/images", thumbnail.filename);
      if (fs.existsSync(thumbnailFilePath)) {
        fs.unlinkSync(thumbnailFilePath);
      }
    }

    // Delete the video and thumbnail documents from the database
    await Video.findByIdAndDelete(videoId);
    if (thumbnail) {
      await Thumbnail.findByIdAndDelete(thumbnail._id);
    }

    return res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
