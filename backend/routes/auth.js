const express=require("express")
const router=express.Router();
const User=require("../models/User")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const fetchuser=require("../middleware/fetchuser")
const JWT_SECRET="Harryisagood$oy";



router.post("/createuser", async (req,res)=>{
    // const errors=validationResult(req);
    // if(!errors.isEmpty()){
    //     return res.status(400).json({errors:errors.array()});
    // }
    let success=false;
    try {
        // Check if the user already exists
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({success, errors: 'Sorry, this email already exists.' });
        }

        // Create the new user
        const salt=await bcrypt.genSalt(10);
        const secPass=await bcrypt.hash(req.body.password,salt);
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        });
        await user.save()
        const data={
            user:{
                id:user.id
            }
        }
        const authtoken=jwt.sign(data,JWT_SECRET);
        console.log(authtoken);
        success=true;
        
        return res.json({success,authtoken})
        // Respond with success message
        // return res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        // Handle any other errors
        console.error(error);
        return res.status(500).json({ errors: 'Server error' });
    }
    // res.json({"Nice":"nice"})
})


router.post("/login",async (req,res)=>{
    const {email,password}=req.body;
    let success=false;
    try{

        let user=await User.findOne({email:email});
        if(!user){
            return res.status(400).json({error:"Please try with correct credentials"})
        }
        const passwordCompare=await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            success=false;
            return res.status(400).json({success,error:"Please try to login with correct credentials"});
        }
        const data={
            user:{
                id:user._id
            }
        }
        const authtoken=jwt.sign(data,JWT_SECRET);
        success=true;
        return res.json({success,authtoken})
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ errors: 'Server error' });
    }
})

router.post("/getuser",fetchuser,async (req,res,next)=>{
    try{
        console.log('Request User:', req.user);  // Debugging statement

        if (!req.user || !req.user.id) {
            return res.status(400).json({ errors: 'User not authenticated' });
        }

        const userId=req.user.id;
        const user=await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ errors: 'User not found' });
        }
        res.send(user);
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({ errors: 'Server error' });
    }

})

module.exports=router