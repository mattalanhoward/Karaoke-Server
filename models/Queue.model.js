//Queue Model
const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const queueSchema = new Schema (
  {
  singerSong: [{type:ObjectId, ref:"singerSong"}],
  },
  {
    timestamps: true
  }
);

module.exports = model("Queue", queueSchema)
