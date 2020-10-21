// routes/auth.routes.js

const { Router } = require("express");
const router = new Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const mongoose = require("mongoose");


////////////////////////////////////////////////////////////////////////
///////////////////////////// PROFILE //////////////////////////////////
////////////////////////////////////////////////////////////////////////

router.get('/update', (req,res, next) => {
  User.find()
  .then(allUsers => {
      console.log(allUsers)
  })
});


////////////////////////////////////////////////////////////////////////
///////////////////////// EDIT PROFILE /////////////////////////////////
////////////////////////////////////////////////////////////////////////

router.post("/editProfile", (req, res, next) => {
  console.log(req.body)
    const { stageName, email, password, userId} = req.body;
    console.log(`CURRENT USER`, userId);

    console.log(req.body)
    if (!stageName || !email || !password) {
      res.status(200).json({
        errorMessage:
          "All fields are mandatory. Please provide your stage name, email and password.",
      });
      return;
    }
  
    // make sure passwords are strong:
  
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res.status(200).json({
        errorMessage:
          "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
      });
      return;
    }
  


    //NEED TO GET CORRECT USER OBJECT ID AND THEN THIS WILL WORK!!
    
    bcryptjs
      .genSalt(saltRounds)
      .then((salt) => bcryptjs.hash(password, salt))
      .then((hashedPassword) => {
        return User.findByIdAndUpdate(userId,{
          // stageName: stageName
          stageName,
          email,
          // password => this is the key from the User model
          //     ^
          //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
          password: hashedPassword,
        });
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
  });

module.exports = router;