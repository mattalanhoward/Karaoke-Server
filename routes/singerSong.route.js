const { Router } = require("express");
const router = new Router();
const Songs = require("../models/Songs.model");
const User = require("../models/User.model");
const SingerSong = require("../models/SingerSong.model");

router.post("/", (req, res) => {
  console.log(`SINGER SONG`, req.body);
  const { userId, songId } = req.body;
  console.log(`SINGER SONG SONG ID`, songId);
  console.log(`SINGER SONG USERID`, userId);

  const singerPromise = User.findById(userId);
  const songsPromise = Songs.findById(songId);

  //promise.all fires the two promises above at the same time.  => faster return.
  Promise.all([singerPromise, songsPromise]).then((allPromises) => {
    const [singer, song] = allPromises;

    SingerSong.create({
      singer: singer._id,
      song: song._id,
      wasSung: false,
    })

      .then((singersong) => {
        //This is a type of populate
        console.log(`SINGER SONG`, { ...singersong.toJSON(), singer, song });
        res.status(200).json({ ...singersong.toJSON(), singer, song });
      })

      .catch((error) => {
        console.log(error);
        res.status(500).json(error);
      });
  });
});

module.exports = router;
