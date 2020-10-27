//Songs Model
const { Schema, model } = require("mongoose");

const songsSchema = new Schema(
  {
    Title: {
      type: String,
      required: true,
    },
    Artist: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Songs", songsSchema);
