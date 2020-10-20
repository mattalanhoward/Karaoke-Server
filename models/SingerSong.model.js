const singerSongSchema = new Schema (
    {
    singer:{type:ObjectId, ref:"User"},  //req with populate search specific user and grab stageName
    song:{type:ObjectId, ref: "Songs"},
    },
    {
    wasSung:{
        type: boolean
      }
    },
    {
      timestamps: true
    }
  );
  
  module.exports = model("singerSong", singerSongSchema)