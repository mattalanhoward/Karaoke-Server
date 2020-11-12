// models/User.model.js

const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    stageName: {
      type: String,
      unique: true,
      required: [true, "Stage Name is required."],
    },
    favoriteArtist: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      // this match will disqualify all the emails with accidental empty spaces, missing dots in front of (.)com and the ones with no domain at all
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    photoUrl: {
      type: String,
      default:
        "https://res.cloudinary.com/dcod1zxnl/image/upload/v1605115637/Screen_Shot_2020-11-11_at_6.25.46_PM_l4ssfm.png",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBarDisplay: {
      type: Boolean,
      default: false,
    },
    totalSongs: {
      type: Number,
      default: 0,
    },
    rank: {
      type: Number,
      default: 0,
    },
    totalUsers: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
