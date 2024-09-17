const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const User = require("../models/User");
const Profile = require("../models/Profiles");
const Videos=require("../models/Videos")
const path = require("path");
const multer = require("multer");

// Serve static files from 'uploads/profiles'
const profileDir = path.join(__dirname, "../uploads/profiles");
router.use("/uploads/profiles", express.static(profileDir));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const imageFiletypes = /jpg|jpeg|png|svg/;
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype.toLowerCase();
  if (imageFiletypes.test(extname) && imageFiletypes.test(mimetype)) {
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

// Fetch profile data
router.get("/profiledata", fetchuser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return res.json(user);
  } catch (error) {
    console.error("Error fetching profileData:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Upload profile picture
router.put("/upload", fetchuser, upload.single("profilePic"), async (req, res) => {
  try {
    const profileFile = req.file;
    console.log(req.file); // Log file received on the server
    if (!profileFile) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      // If a profile already exists, update the existing entry
      profile.filename = profileFile.filename;
      profile.path = profileFile.path;
      profile.originalname = profileFile.originalname;
      await profile.save();
      return res.json({ message: "Profile picture updated successfully" });
    } else {
      // If no profile exists, create a new one
      profile = new Profile({
        user: req.user.id,
        filename: profileFile.filename,
        path: profileFile.path,
        originalname: profileFile.originalname,
      });
      

      await profile.save();
      return res.json({ message: "Profile picture uploaded successfully" });
  }} catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Fetch profile picture for the logged-in user
router.get("/fetchprofilepic", fetchuser, async (req, res) => {
  try {
    const profiles = await Profile.find({ user: req.user.id });
    const profilesWithDetails = profiles.map((profile) => ({
      filename: profile.filename,
      url: `http://localhost:5000/uploads/profiles/${profile.filename}`,
    }));
    return res.status(200).json(profilesWithDetails);
  } catch (error) {
    console.error("Error fetching profile pictures:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.get("/fetchvideocount",fetchuser,async (req,res)=>{
  try{
    const userId=req.user.id;
    if(!userId){
      return res.status(401).json({message:"Unauthorized"})
    }
    const videoCount=await Videos.countDocuments({user:userId});
    return res.status(200).json({videoCount});
  }
  catch (error) {
    console.error("Error fetching video count:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
})
router.get("/fetchvideocount/:userid",fetchuser,async (req,res)=>{
  try{
    const userId=req.params.id;
    if(!userId){
      return res.status(401).json({message:"Unauthorized"})
    }
    const videoCount=await Videos.countDocuments({user:userId});
    return res.status(200).json({videoCount});
  }
  catch (error) {
    console.error("Error fetching video count:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
})

module.exports = router;
