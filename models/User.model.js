// models/User.model.js

const { Schema, model } = require('mongoose');

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
      required: [true, "Stage Name is required."]

    },
    email: {
      type: String,
      required: [true, "Email is required."],
      // this match will disqualify all the emails with accidental empty spaces, missing dots in front of (.)com and the ones with no domain at all
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "Password is required."]
    },
    photoUrl: {
      type: String
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = model("User", userSchema);