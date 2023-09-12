var mongoose = require("mongoose")


var fileschema = mongoose.Schema({
  Date:{
    type:Date,
    default: new Date()
  },
  file:String,
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
  },
  filesize:String

})

module.exports = mongoose.model("file",fileschema)