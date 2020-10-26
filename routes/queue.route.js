const { Router } = require("express");
const router = new Router();
const Queue = require("../models/Queue.model");

router.post("/addSong", (req, res) => {
  console.log(`ADD SONG BODY SINGER`, req.body.newSignUp);
  const { newSignUp } = req.body;

  //checks if queue exists
  Queue.find({}, function (err, queues) {
    console.log(`QUEUES`, queues);
    if (err) {
      console.log(err);
    }
    //if no queue, create one and add 1st singerSong to it.
    if (!queues.length) {
      console.log(`No QUEUE`);
      Queue.create({
        singerSong: newSignUp._id,
      });
    } else {
      //if queue exists, adds to it.
      Queue.findOneAndUpdate(
        {},
        { $push: { singerSong: newSignUp._id } },
        { safe: true, upsert: true, new: true }
      )
        .then((updatedQueue) => {
          console.log(updatedQueue);
          Queue.findOne({}).populate({
            path: "singerSong",
          });
          res.status(200).json({ updatedQueue });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json(`ERROR adding Singersong to Queue`, error);
        });
    }
  });
});

module.exports = router;
