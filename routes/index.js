var express = require('express');
var router = express.Router();
var passport = require("passport")
var localStrategy = require("passport-local")
var usermodel = require("./users.js")
var filesmodel = require("./files.js")
var multer = require("multer")
var path = require("path");
const files = require('./files.js');
const fs = require("fs")
const { google } = require('googleapis');
require("dotenv").config()
const { exec } = require('child_process');
var GoogleStrategy = require('passport-google-oidc');
const OAuth2 = google.auth.OAuth2;

passport.use(new localStrategy(usermodel.authenticate()))


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    // const nd = new Date()
    // const fn = nd.getTime() + Math.floor(Math.random()*1000000) + path.extname(file.originalname)
    // cb(null, file.fieldname + fn)
    cb(null, Date.now() + '-' + file.originalname);

  }
})

const upload = multer({ storage: storage })

passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: '/oauth2/redirect/google',
  scope: ['email','profile' ]
}, async function verify(issuer, profile,cb) {
  console.log(profile)
  let exitingUser = await usermodel.findOne({email : profile.emails[0].value });

  if(exitingUser)
  {
    return cb(null,exitingUser);
  }
  else
  {
    let newUser = await usermodel.create({username:profile.displayName,email:profile.emails[0].value})
      
    return cb(null,newUser);
  }
}));
  


router.get('/', function(req, res, next) {
  res.render('register');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});


router.get('/index',isloggedin,function(req, res, next) {
  usermodel.findOne({username:req.session.passport.user})
    .populate("files")
    .then((user)=>{
    res.render("index",{user})
  })
});


router.get('/users',isloggedin,function(req, res, next) {
  usermodel.find().then(function(allusers){
    res.send(allusers)
  })
});

router.post("/register",function(req,res){
  var newuser = new usermodel({
    email:req.body.email,
    username:req.body.username
  })
  usermodel.register(newuser,req.body.password).then(function(u){
    passport.authenticate(`local`)(req,res,function(){
      res.redirect("/index")
    })
  })
})



router.post(`/login`,passport.authenticate(`local`,{
  successRedirect: `/index`,
  failureRedirect:`/`
}),function(req,res,next){})


router.get("/logout",function(req,res,next){
  req.logout(function(err){
    if(err){
      return next (err) 
    }
    else {
      res.redirect("/login")
    }
  })
});


function isloggedin (req,res,next){
  if(req.isAuthenticated()){
    return next ()
  }
  else{
    res.redirect("/")
  }
}

router.post("/uploadfiles",upload.single("file") ,isloggedin, (req,res)=>{
  usermodel.findOne({username:req.session.passport.user}).then(function(loggedinuser){
    filesmodel.create({
      username: loggedinuser._id,
      file:req.file.filename,
      filesize:req.file.size,
    }).then(function(uploadedFile){
      loggedinuser.files.push(uploadedFile._id)
      loggedinuser.save()
      .then(function(){
      res.redirect("back")
      })
    })
  })
})


router.get("/files",async (req,res)=>{ 
  var filename = await filesmodel.find({filename:req.params.files})
  res.send(filename)
})

 
router.get("/file/:filename",isloggedin,(req,res)=>{ 
      var dataa = req.params.filename
      const filePath = `./public/uploads/${dataa}`;
      // make sure to give correct path and file exist or not
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.error('File not found.');
          return;
        }
        // this is used for opening the file 
        exec(`start ${filePath}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error opening file: ${error.message}`);
            return;
          }
          console.log('File opened successfully.');
        });
      });
      res.redirect("back")
})


router.get('/login/federated/google', passport.authenticate('google'));

router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: '/index',
  failureRedirect: '/login'
}));


module.exports = router;
