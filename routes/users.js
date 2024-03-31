var mongoose = require("mongoose")
var plm = require("passport-local-mongoose")

mongoose.connect(process.env.MONGODB_URL).then(function(){
  console.log("connected to db")
}).catch((error)=>{
  console.log(error)
})

var userschema = mongoose.Schema({
  email: String,
  username:String,
  password:String,
  files:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"file"
  }]
})
userschema.plugin(plm)

module.exports = mongoose.model("user",userschema)