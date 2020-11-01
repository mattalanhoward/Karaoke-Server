const { Router } = require("express");
const router = new Router();
const Queue = require("../models/Queue.model");

//Get updated Queue
router.get("/", (req, res) => {
  console.log(`Get Queue`, req.body);

  Queue.find()
    .sort({ date: -1 })
    .then((queueFromDb) => {
      console.log(`Current Queue`, queueFromDb);
      res.status(200).json({ queueFromDb });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(`ERROR getting the queue`, error);
    });
});

//Add singersong to queue
router.post("/addSong", (req, res) => {
  console.log(`ADD SONG BODY SINGER`, req.body.newSignUp);
  const { newSignUp } = req.body;

  // Find most recent queue by date and then add to it.
  Queue.findOneAndUpdate(
    {},
    { $push: { singerSong: newSignUp._id } },
    { safe: true, upsert: true, new: true }
  )
    .sort({ date: -1 })
    .then((updatedQueue) => {
      console.log(updatedQueue);
      Queue.findOne({}).populate({
        path: "singerSong",
      });
      console.log(`UPdated Queue`, updatedQueue);
      res.status(200).json({ updatedQueue });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(`ERROR adding Singersong to Queue`, error);
    });
});

//Gets Singer and Song Details
//singerSong => Singer Song
router.get("/:id", (req, res) => {
  console.log(`GETTIN THE LIST DETAILS of QUEUE ID`, req.params);
  Queue.findById(req.params.id)

    //Deep Populate
    .populate({
      path: "singerSong",
      model: "SingerSong",
      populate: {
        path: "singer",
        model: "User",
      },
    })
    .populate({
      path: "singerSong",
      model: "SingerSong",
      populate: {
        path: "song",
        model: "Songs",
      },
    })

    .then((response) => {
      // const song = response.singerSong[0].song;
      const song = response.singerSong;
      // console.log(song.Title, song.Artist);
      res.status(200).json({ song });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(`ERROR getting song details`, error);
    });
});

module.exports = router;

// populate({
//   path: 'friends',
//   // Get friends of friends - populate the 'friends' array for every friend
//   populate: { path: 'friends' }
// }).
