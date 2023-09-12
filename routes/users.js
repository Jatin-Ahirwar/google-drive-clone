var mongoose = require("mongoose")
var plm = require("passport-local-mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/google-drive")

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