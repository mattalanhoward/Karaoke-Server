// routes/auth.routes.js

const { Router } = require("express");
const router = new Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const mongoose = require("mongoose");
// include CLOUDINARY:
const uploader = require("../config/cloudinary");

////////////////////////////////////////////////////////////////////////
///////////////////////////// PROFILE //////////////////////////////////
////////////////////////////////////////////////////////////////////////

router.post("/", (req, res, next) => {
  const {
    firstName,
    lastName,
    favoriteArtist,
    stageName,
    email,
    userId,
  } = req.body;
  User.findById(userId)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => res.status(500).json({ errorMessage: error }));
});

////////////////////////////////////////////////////////////////////////
///////////////////////// EDIT PROFILE /////////////////////////////////
////////////////////////////////////////////////////////////////////////

router.post("/editProfile", (req, res) => {
  // console.log(`EDIT PROFILE FAVORITES~`, req.body);
  const {
    firstName,
    lastName,
    stageName,
    favoriteArtist,
    email,
    password,
    userId,
    photoUrl,
  } = req.body;

  const body = Object.fromEntries(
    Object.entries(req.body).filter((element) => element[1])
  );

  User.findByIdAndUpdate(userId, body, {
    firstName,
    lastName,
    stageName,
    favoriteArtist,
    email,
    photoUrl,
  })
    .then((user) => {
      res.status(200).json(user);
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

router.post("/upload", uploader.single("photoUrl"), (req, res, next) => {
  const {
    firstName,
    lastName,
    stageName,
    favoriteArtist,
    email,
    password,
    userId,
    photoUrl,
  } = req.body;

  User.findByIdAndUpdate(userId, {
    photoUrl,
  })
    .then((path) => {
      res.status(200).json(req.file.path);
    })
    .catch((error) => res.status(500).json({ errorMessage: error }));
});

module.exports = router;
