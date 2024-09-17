const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Profile = require("../models/Profiles");
const path = require("path");
const fetchuser = require("../middleware/fetchuser");

const profileDir = path.join(__dirname, "../uploads/profiles");
router.use("/uploads/profiles", express.static(profileDir));

router.get("/profiledata/:userid", async (req, res) => {
    try {
        const userId = req.params.userid;
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
      } catch (error) {
        console.error("Error fetching video:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
      }
});

router.get("/fetchprofilepic/:userid",async(req,res)=>{
    try{
        const userId = req.params.userid;
        const profiles = await Profile.find({ user: userId });
        const profilesWithDetails = profiles.map((profile) => ({
        filename: profile.filename,
        url: `http://localhost:5000/uploads/profiles/${profile.filename}`,
        }));
        res.status(200).json(profilesWithDetails);
    }
    catch (error) {
        console.error("Error fetching profile pictures:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
})


router.post("/subscribe/:userid",fetchuser,async(req,res)=>{
  try{
        const userIdToSubscribe = req.params.userid;

        const loggedInUserId = req.user.id;

        if (userIdToSubscribe === loggedInUserId) {
            return res.status(400).json({ msg: "You cannot subscribe to yourself." });
        }

        const userToSubscribe = await User.findById(userIdToSubscribe);
        const loggedInUser = await User.findById(loggedInUserId);

        if (!userToSubscribe || !loggedInUser) {
            return res.status(404).json({ msg: "User not found." });
        }

        // Check if already following
        if (loggedInUser.following.includes(userIdToSubscribe)) {
            loggedInUser.following = loggedInUser.following.filter(id => id !== userIdToSubscribe);
            userToSubscribe.followers -= 1;
            await loggedInUser.save();
            await userToSubscribe.save();
            return res.json({ msg: "Unsubscribed successfully" });
        }

        // Add the user to the following list and increment the followers count
        loggedInUser.following.push(userIdToSubscribe);
        userToSubscribe.followers += 1;

        await loggedInUser.save();
        await userToSubscribe.save();

        return res.json({ msg: "Subscribed successfully." });
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
}
})

// Route to check if the logged-in user is subscribed to another user
router.get("/check-subscription/:userid", fetchuser, async (req, res) => {
    try {
        const userIdToCheck = req.params.userid;
        const loggedInUserId = req.user.id;

        const loggedInUser = await User.findById(loggedInUserId);

        if (!loggedInUser) {
            return res.status(404).json({ msg: "User not found." });
        }

        const isSubscribed = loggedInUser.following.includes(userIdToCheck);
        return res.json({ isSubscribed });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});


// router.post("/unsubscribe/:userid",fetchuser,async(req,res)=>{
//     try{
//           const userIdToSubscribe = req.params.userid;
//           const loggedInUserId = req.user.id;
  
//           if (userIdToSubscribe === loggedInUserId) {
//               return res.status(400).json({ msg: "You cannot subscribe to yourself." });
//           }
  
//           const userToSubscribe = await User.findById(userIdToSubscribe);
//           const loggedInUser = await User.findById(loggedInUserId);
  
//           if (!userToSubscribe || !loggedInUser) {
//               return res.status(404).json({ msg: "User not found." });
//           }
  
//           // Check if already following
//         //   if (loggedInUser.following.includes(userIdToSubscribe)) {
//         //       return res.status(400).json({ msg: "You are already following this user." });
//         //   }
  
//           // Add the user to the following list and increment the followers count
//           loggedInUser.following.push(userIdToSubscribe);
//           userToSubscribe.followers += 1;
  
//           await loggedInUser.save();
//           await userToSubscribe.save();
  
//           return res.json({ msg: "Subscribed successfully." });
//     }
//     catch (error) {
//       console.error(error.message);
//       res.status(500).send('Server error');
//   }
//   })

module.exports = router;