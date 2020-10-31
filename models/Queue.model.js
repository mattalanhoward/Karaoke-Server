//Queue Model
const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;
const moment = require("moment");

const queueSchema = new Schema(
  {
    singerSong: [{ type: ObjectId, ref: "SingerSong" }],
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Queue", queueSchema);
