import mongoose, { Schema, model } from "mongoose";

const songSchema = new Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  genre: { type: String, required: true },
  duration: {
    seconds: { type: Number, required: true, default: 0 },
    minutes: { type: Number, required: true, default: 0 },
  },
  reviews: [
    {
      reviewer: { type: String },
      rating: { type: Number, required: true, default: 0 },
    },
  ],
});

const Song = mongoose.models.Song || model("songs", songSchema);

export default Song;
