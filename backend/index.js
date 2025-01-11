const connectToMongo=require("./db")
const express=require("express")
var cors=require("cors");
const uploadRouter = require('./routes/posts.js');
const profileRouter = require('./routes/profile.js');
const channelRouter = require('./routes/channel.js');
const videoPlayerRouter = require('./routes/videoplayer.js');


const app=express()
const port= process.env.PORT || 5000



app.use(cors())
app.use(cors({
    origin: ['http://localhost:3000',"https://u-tube-youtube-clone-frontend.vercel.app"], // Allow only this origin to access the server
    methods: 'GET,POST,PUT,DELETE,OPTIONS', // Allowed HTTP methods
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept', // Allowed headers
    credentials: true // If you need to send cookies or HTTP authentication
}));
app.use(express.json())

app.get("/",(req,res)=>{
    res.status(200).send("Hello from the server")
})

app.use(uploadRouter)
app.use(profileRouter)
app.use(channelRouter)
app.use(videoPlayerRouter)

app.use("/api/auth",require("./routes/auth"));
app.use("/api/posts",require("./routes/posts"));
app.use("/api/homeContent",require("./routes/homeContent"));
app.use("/api/profile",require("./routes/profile"));
app.use("/api/channel",require("./routes/channel"));
app.use("/api/videoplayer",require("./routes/videoplayer.js"))
app.use("/api/searchbar",require("./routes/searchbar.js"))


app.listen(port,()=>{
    console.log("example")
})