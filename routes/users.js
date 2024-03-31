var mongoose = require("mongoose")
var plm = require("passport-local-mongoose")

mongoose.connect(process.env.MONGODB_URL)
// mongoose.connect("mongodb+srv://jatinahirwar1089:TpCfsp1YbBV0lgYP@google-drive.bsn70zk.mongodb.net/?retryWrites=true&w=majority&appName=google-drive")

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