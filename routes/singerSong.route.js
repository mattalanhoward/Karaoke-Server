const { Router } = require("express");
const router = new Router();
const Songs = require("../models/Songs.model");
const User = require("../models/User.model");
const SingerSong = require("../models/SingerSong.model");
const { update } = require("../models/User.model");

router.post("/", (req, res) => {
  // console.log(`SINGER SONG`, req.body);
  const { userId, songId } = req.body;
  // console.log(`SINGER SONG SONG ID`, songId);
  // console.log(`SINGER SONG USERID`, userId);

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
        // console.log(`SINGER SONG`, { ...singersong.toJSON(), singer, song });
        res.status(200).json({ ...singersong.toJSON(), singer, song });
      })

      .catch((error) => {
        console.log(error);
        res.status(500).json(error);
      });
  });
});

router.post("/complete", (req, res) => {
  SingerSong.findByIdAndUpdate(req.body.singerSongId)
    .then((updateSung) => {
      //toggle true/false for wasSung
      updateSung.wasSung = !updateSung.wasSung;
      updateSung.save();

      //increment/decrement users totalsongs based on wasSung = true/false
      User.findByIdAndUpdate(updateSung.singer).then((incrementUser) => {
        updateSung.wasSung
          ? incrementUser.totalSongs++
          : incrementUser.totalSongs--;
        incrementUser.save();
      });

      //get all users
      User.find()
        //sort by total songs sung descending.
        .sort({ totalSongs: -1 })
        .then((sortedUsers) => {
          //find the index of updateSung.singer
          const index = sortedUsers.findIndex(
            (user) => user._id == `${updateSung.singer}`
          );

          User.findByIdAndUpdate(updateSung.singer).then((updateRankings) => {
            updateRankings.rankings.rank = index + 1;
            updateRankings.rankings.totalUsers = User.length;
            updateRankings.save();
          });
        });

      res.status(200).json(updateSung);
    })

    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

//User Deletes Signup
router.post("/deleteSignup", (req, res) => {
  // console.log(`Delete Signup`, req.body.singerSongId);
  SingerSong.findByIdAndDelete(req.body.singerSongId)
    .then((deletedSignup) => {
      // console.log(deletedSignup);
      res.status(200).json({ deletedSignup });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(`ERROR getting the queue`, error);
    });
});

module.exports = router;
