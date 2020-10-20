# Noda 101 Singer Signup

<br>

## Problem Statement

Karaoke Singers at Noda 101 need a more efficient manner of signing up to sing songs because the current system is outdated / inefficient and not sanitary.

## Description

This is an app to allow users to search through a list of songs and then sign up to sing them at a karaoke bar.

<br>

## User stories

**_ANON ROUTES_**

- **404:** As an anon/user I can see a 404 page if I try to reach a page that does not exist so that I know it"s my fault.
- **Signup:** As an anon I can sign up in the platform so that I can search songs and signup to sing.
- **Login:** As a user I can login to the platform.
- **Logout:** As a user I can logout from the platform so no one else can use it.
- **QUEUE:** Queue is saved and cleared at 4:00am local time.

<br>

**_AUTH ROUTES _**

**_ BASIC USER _**

- **Search:** As a user, I would like to see a full list of songs and be able to search through them.
- **Create:** As a user, I can create my profile (stageName, email, photoUrl).
- **Edit:** As a user, I can edit my profile (stageName, email, photoUrl).
- **Add Songs to the Signup List:** As a user I can add songs to the signup list.
- **View Singer Queue:** As a user I can view the singer queue.

**_ DJ_**

- **Login:** As a DJ I can login to the platform.
- **Logout:** As a DJ I can logout from the platform so no one else can use it.
- **Create:** As a DJ, I can create my profile (stageName, email, photoUrl).
- **Edit:** As a DJ, I can edit my profile (stageName, email, photoUrl).
- **View Singer Queue:** As a DJ, I can view the singer queue.
- **Mark Songs Sung:** As a DJ, I can mark songs that have been sung.

  <br>

## Backlog

- **Edit Song** As a user I can edit MY song from the singer queue.
- **Delete Song** As a user I can delete MY song from the singer queue.
- **View Ranks** As a user I can see the singers who have sung the most at Noda 101.
- **Artist Scroll** As a User, I would like to filter by artist and scroll A-Z.
- **Song Scroll** As a User, I would like to filter by song and scroll A-Z.
- **Song Details** As a User, I would like to view song lyrics.
- **DJ Edit Queue** As a DJ, I can edit the order of the singer queue by only 1 index.
- **Location services:** Make sure people who signup for songs are in the bar.
- **History** As a user I can view my song history.
- **Most Popular** As a user I can view list of most sung songs.
- **View Other Profiles** As a user I can view other peoples profiles.
- **Seasonal Recommendations** As a user I can view a seasonal songlist (Thriller, Summertime, Christmas)

<br>

# Server / Backend

## Models

```javascript

//USER MODEL
const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;


const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required."]
    },
    lastName: {
      type: String,
      required: [true, "Last name is required."]
    },
    stageName: {
      type: String,
      unique: true
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
    passwordHash: {
      type: String,
      required: [true, "Password is required."]
    },
    zipCode: {
      type: Number,
    },
    photoUrl: {
      type: String
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    favorites:{
      [{
        type: ObjectId, ref: "Song"
      }]
    },
    songCount:{
      type: Number
    }
  },
  {
    timestamps: true
  }
);

module.exports = model("User", userSchema);


//SESSION MODEL
const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const sessionSchema = new Schema({
  userId: { type: ObjectId, ref: "User" },
  createdAt: {
    type: Date,
    default: Date.now(),
    index: { expires: 60*1*60 }
  },
});

const Session = model("Session", sessionSchema);

module.exports = Session;


//Song Model
const { Schema, model } = require("mongoose");

const songSchema = new Schema(
  {
    songName: {
      type: String,
      required: true
    },
    artistName: {
      type: String,
      required: true
  },
    wasSung:{
      type: boolean
    }
  {
    timestamps: true
  }
);

module.exports = model("Song", songSchema);


//Queue Model
const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const queueSchema = new Schema (
  {
  songQueue: [{type: ObjectId, ref: "User"}, {type: ObjectId, ref: "Song"}],
},
  {
    timestamps: true
  }
);

module.exports = model("Queue", queueSchema)

```

<br>

## API Endpoints (backend routes)

| HTTP Method | URL                | Request Body                                                 | Success | Error | Description            |
| ----------- | ------------------ | ------------------------------------------------------------ | ------- | ----- | ---------------------- |
| POST        | `/auth/signup`     | {firstName, lastName, username, password}                    | 201     | 404   | auth.routes.js         |
| POST        | `/auth/login`      | {email, password}                                            | 200     | 404   | login.routes.js        |
| POST        | `/auth/logout`     | (empty)                                                      | 204     | 400   |                        |
| PUT         | `/profile/edit`    | {email, stageName, photoUrl, password}                       | 200     | 400   | Edits user's info      |
| GET         | `/profile`         | {email, stageName, photoUrl, password, songCount, favorites} | 200     | 400   | View user info         |
| GET         | `/search`          |                                                              | 200     | 400   | Seach by keyword       |
| GET         | `/song-list`       |                                                              | 200     | 400   | Sort by Artist/Song    |
| GET         | `/queue`           |                                                              | 200     | 400   | View Queue             |
| PUT         | `/queue/edit/{id}` |                                                              | 200     | 400   | Edit Song in Queue     |
| DELETE      | `/queue/delete`    |                                                              | 200     | 400   | Delete Song from Queue |

<br>

## Links

### Trello

[Go to Trello Board](https://trello.com/b/Z50vb5SM/noda-101)

### Github

[Server Repository](https://github.com/valmgisbert/legend-of-iron-server)

[Client Repository](https://github.com/valmgisbert/legend-of-iron)

[Deployed App Link](

### Slides

[GSlides](https://docs.google.com/presentation/d/1bKVonZvvS5zhpmzB60UIB2CO1sDBJNT__s5HQtq2nDU/edit?usp=sharing)
