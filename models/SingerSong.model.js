const { Schema, model } = require("mongoose");

const singerSongSchema = new Schema(
  {
    singer: { type: Schema.Types.ObjectId, ref: "User" }, //req with populate search specific user and grab stageName
    song: { type: Schema.Types.ObjectId, ref: "Songs" },
    wasSung: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("SingerSong", singerSongSchema);
