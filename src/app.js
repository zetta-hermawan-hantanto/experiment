import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Song from "../database/models/song.model.js";

(async (err) => {
  await mongoose.connect("mongodb://localhost:27017/songs-db");

  if (err) {
    console.log(err);
  }

  console.log("connected");
})();

const app = express();

app.use(express.json());
app.use(cors());

// basic auth
app.use((req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      status: "Fail",
      message: "You are not authenticated",
    });
  }

  const [username, password] = authorization.split(":");

  if (username !== process.env.USERNAME && password !== process.env.PASSWORD) {
    return res.status(401).json({
      status: "Fail",
      message: "You are not authenticated",
    });
  }

  next();
});

app.post("/webhooks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, artist, genre, duration, addReviews, deleteReviews } =
      req.body;

    console.log(title);

    const updatedData = await Song.findByIdAndUpdate(
      id,
      {
        $set: { title, artist, genre, duration },
        $push: { reviews: { $in: addReviews } },
      },
      { new: true }
    );

    if (!updatedData) {
      return res.status(404).json({
        status: "Fail",
        message: "Data not found",
      });
    }

    await updatedData.reviews.pull({ $in: deleteReviews });
    updatedData.save();

    return res.status(200).json({
      status: "Success",
      data: updatedData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "Failed",
      message: "Internal server error",
    });
  }
});

app.listen(8000, () => {
  console.log("connect to http://localhost:8000");
});
