//Songs Model
const { Schema, model } = require("mongoose");

const songsSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    artist: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = model("Songs", songsSchema);