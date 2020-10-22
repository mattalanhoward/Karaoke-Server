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

// FROM DEBORA => This returns same value if field is left blank.
// router.post('/auth/:user/edit', async (req, res) => {
//   const { user, campus, course, image } = req.params;
//   const body = Object.fromEntries(
//     Object.entries(req.body).filter((element) => element[1])
//   );
//   {key:value, key:value}
//   try {
//     const response = await User.findByIdAndUpdate(userId, body, {
//       new: true,
//     });
//     return res.json({ path: '/????/' });
//   } catch (error) {
//     console.log(`error while editing a user ${error}`);
//   }
// });

router.post("/editProfile", (req, res) => {
  console.log(req.body)
    const { firstName, lastName, stageName, email, password, userId, photoUrl } = req.body;
    console.log(`CURRENT USER`, userId);

    const body = Object.fromEntries(
    Object.entries(req.body).filter((element) => element[1])
  );

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


//SAME AS ABOVE BUT WITH PASSWORD
// router.post("/editProfile", (req, res, next) => {
//   console.log(req.body)
//     const { firstName, lastName, stageName, email, password, userId, photoUrl } = req.body;
//     console.log(`CURRENT USER`, userId);

//     console.log(req.body)
//     if (!stageName || !email || !password) {
//       res.status(200).json({
//         errorMessage:
//           "Missing mandatory fields. Please provide your stage name, email and password.",
//       });
//       return;
//     }
  
//     // make sure passwords are strong:
//     const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
//     if (!regex.test(password)) {
//       res.status(200).json({
//         errorMessage:
//           "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
//       });
//       return;
//     }
  

    
//     bcryptjs
//       .genSalt(saltRounds)
//       .then((salt) => bcryptjs.hash(password, salt))
//       .then((hashedPassword) => {
//         return User.findByIdAndUpdate(userId,{
//           firstName, 
//           lastName,
//           stageName,
//           email,
//           photoUrl,
//           // password => this is the key from the User model
//           //     ^
//           //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
//           password: hashedPassword,
//         });
//       })
//       .catch((error) => {
//         if (error instanceof mongoose.Error.ValidationError) {
//           res.status(200).json({ errorMessage: error.message });
//         } else if (error.code === 11000) {
//           res.status(200).json({
//             errorMessage:
//               "Stage name and email need to be unique. Either stage name or email is already used.",
//           });
//         } else {
//           res.status(500).json({ errorMessage: error });
//         }
//       }); // close .catch()
//   });




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