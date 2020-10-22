// routes/auth.routes.js

const { Router } = require("express");
const router = new Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const mongoose = require("mongoose");
// include CLOUDINARY:
const uploader = require('../config/cloudinary');

////////////////////////////////////////////////////////////////////////
///////////////////////////// PROFILE //////////////////////////////////
////////////////////////////////////////////////////////////////////////

router.post("/", (req,res, next) => {
  const { firstName, lastName, stageName, email, userId} = req.body;
  console.log(`VIEW PROFILE`)
  console.log(userId)
  User.findById(userId)
  .then((user)=> {
    res.status(200).json(user)
  })
 
});


////////////////////////////////////////////////////////////////////////
///////////////////////// EDIT PROFILE /////////////////////////////////
////////////////////////////////////////////////////////////////////////

router.post("/editProfile", (req, res, next) => {
  console.log(req.body)
    const { firstName, lastName, stageName, email, password, userId, photoUrl } = req.body;
    console.log(`CURRENT USER`, userId);

    console.log(req.body)

      User.findByIdAndUpdate(userId,{
          firstName, 
          lastName,
          stageName,
          email,
          photoUrl,
        })
        .then((user)=> {
          res.status(200).json(user)
        })
      
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          res.status(200).json({ errorMessage: error.message });
        } else if (error.code === 11000) {
          res.status(200).json({
            errorMessage:
              "Stage name and email need to be unique. Either stage name or email is already used.",
          });
        } else {
          res.status(500).json({ errorMessage: error });
        }
      }); // close .catch()
    })




////////////////////////////////////////////////////////////////////////
///////////////////////// UPLOAD PHOTO /////////////////////////////////
////////////////////////////////////////////////////////////////////////


 
router.post('/upload', uploader.single("photoUrl"), (req, res, next) => {
  const { firstName, lastName, stageName, email, password, userId, photoUrl } = req.body;
  console.log(`CURRENT USER in PHOTO UPLOAD`, userId);
  console.log(`UPload USER ID`, req.body)
  console.log('file is: ', req.file)
    // console.log(`PATH`, req.file.path)
    User.findByIdAndUpdate("5f900af3a0d02106ef89ce8d",{
      photoUrl:req.file.path,
    });
    if (!req.file) {
      next(new Error('No file uploaded!'));
      return;
    }
    // get secure_url from the file object and save it in the 
    // variable 'secure_url', but this can be any name, just make sure you remember to use the same in frontend
    res.json({ secure_url: req.file.secure_url });
})


module.exports = router;