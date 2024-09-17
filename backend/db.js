const mongoose=require("mongoose")
mongoose.connect('mongodb://localhost:27017/youtube')
  .then(() => console.log('Connected!'));

  module.exports