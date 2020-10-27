//Queue Model
const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const queueSchema = new Schema(
  {
    singerSong: [{ type: ObjectId, ref: "SingerSong" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Queue", queueSchema);
