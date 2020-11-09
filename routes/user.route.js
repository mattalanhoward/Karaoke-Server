// routes/auth.routes.js

const { Router } = require("express");
const router = new Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const User = require("../models/User.model");
const Session = require("../models/Session.model");
const Queue = require("../models/Queue.model");
const mongoose = require("mongoose");
const moment = require("moment");

////////////////////////////////////////////////////////////////////////
///////////////////////////// SIGNUP //////////////////////////////////
////////////////////////////////////////////////////////////////////////

// .post() route ==> to process form data
router.post("/signup", (req, res, next) => {
  let start = moment()
    .startOf("day")
    .add(4, "hours")
    .format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  console.log(`Start`, start);
  let end = moment()
    .startOf("day")
    .add(1, "day")
    .add(4, "hours")
    .format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  console.log(`End`, end);
  // checks if queue exists
  Queue.find(
    {
      date: {
        $gt: start,
        $lt: end,
      },
    },
    (err, queues) => {
      if (err) {
        console.log(err);
      }
      //if no queue, create one
      if (!queues.length) {
        console.log(`No QUEUE`);
        Queue.create({
          date: Date.now(),
        });
      }
    }
  );
  const { stageName, email, password } = req.body;

  if (!stageName || !email || !password) {
    res.status(200).json({
      errorMessage:
        "All fields are mandatory. Please provide your stage name, email and password.",
    });
    return;
  }

  // make sure passwords are strong:

  const regex = /(?=.*\d).{6,}/;
  if (!regex.test(password)) {
    res.status(200).json({
      errorMessage:
        "Password needs to have at least 6 characters and must contain at least one number",
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        stageName,
        email,
        // password => this is the key from the User model
        //     ^
        //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
        password: hashedPassword,
      });
    })
    .then((user) => {
      Session.create({
        userId: user._id,
        createdAt: Date.now(),
      }).then((session) => {
        res.status(200).json({ accessToken: session._id, user });
      });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(200).json({ errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(200).json({
          errorMessage: "Either stage name or email is already used.",
        });
      } else {
        res.status(500).json({ errorMessage: error });
      }
    }); // close .catch()
});

////////////////////////////////////////////////////////////////////////
///////////////////////////// LOGIN ////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// .post() login route ==> to process form data
router.post("/login", (req, res, next) => {
  let start = moment()
    .startOf("day")
    .add(4, "hours")
    .format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  console.log(`Start`, start);
  let end = moment()
    .startOf("day")
    .add(1, "day")
    .add(4, "hours")
    .format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  console.log(`End`, end);
  // checks if queue exists
  Queue.find(
    {
      date: {
        $gt: start,
        $lt: end,
      },
    },
    (err, queues) => {
      if (err) {
        console.log(err);
      }
      //if no queue for today, create one
      if (!queues.length) {
        console.log(`No QUEUE`);
        Queue.create({
          date: Date.now(),
        });
      }
    }
  );

  //For testing
  // Queue.create({});

  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(500).json({
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.status(200).json({
          errorMessage: "Email is not registered.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        Session.create({
          userId: user._id,
          createdAt: Date.now(),
        }).then((session) => {
          res.status(200).json({ accessToken: session._id, user });
        });
      } else {
        res.status(200).json({ errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => res.status(500).json({ errorMessage: error }));
});

////////////////////////////////////////////////////////////////////////
///////////////////////////// LOGOUT ////////////////////////////////////
////////////////////////////////////////////////////////////////////////

router.post("/logout", (req, res) => {
  Session.deleteOne({
    userId: req.body.accessToken,
  })
    .then((session) => {
      res.status(200).json({ success: "User was logged out" });
    })
    .catch((error) => res.status(500).json({ errorMessage: error }));
});

router.get("/session/:accessToken", (req, res) => {
  const { accessToken } = req.params;
  Session.findById({ _id: accessToken })
    .populate("userId")
    .then((session) => {
      if (!session) {
        res.status(200).json({
          errorMessage: "Session does not exist",
        });
      } else {
        res.status(200).json({
          session,
        });
      }
    })
    .catch((err) => res.status(500).json({ errorMessage: err }));
});

module.exports = router;
