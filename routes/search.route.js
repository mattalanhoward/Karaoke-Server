const { Router } = require("express");
const router = new Router();
const mongoose = require("mongoose");
const Songs = require("../models/Songs.model");

router.get("/songs/:Search", (req, res) => {
  console.log(`SEARCH PARAMS`, req.params);
  console.log(`SEARCH SONGS`, req.params.Title);
  const searchParams = req.params.Search;

  Songs
    // get ALL occurrences (g), be case insensitive (i)
    .find({
      $or: [
        { Title: RegExp(`\\b${searchParams}`, "gi") },
        { Artist: RegExp(`\\b${searchParams}`, "gi") },
      ],
    })
    // .find({$or:[{"Title":{"$regex":`${searchParams}`}},{"Artist":{"$regex":`${searchParams}`}}]})
    .then((songResults) => {
      console.log(`SEARCH RESULTS FROM DB`, songResults);
      res.status(200).json(songResults);
    })
    .catch((error) => res.status(500).json({ errorMessage: error }));
});

module.exports = router;
