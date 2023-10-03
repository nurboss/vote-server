const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const voteSchema = require("../schemas/voteSchema");
const Vote = new mongoose.model("Vote", voteSchema);

// get all Vote
router.get("/", async (req, res) => {
  try {
    const data = await Vote.find();
    res.status(200).json({
      result: data,
      message: "Vote was send successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "There was a Server Side Error!" });
  }
});

// post A Vote
router.post("/", async (req, res) => {
  try {
    const newVote = new Vote(req.body);
    await newVote.save();

    res.status(200).json({
      newVote,
      message: "Vote was inserted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server-side error",
    });
  }
});

// patch vots

router.patch("/:id", async (req, res) => {
  try {
    const deviceId =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    // Check if the device has already voted
    const hasVoted = await Vote.exists({
      _id: req.params.id,
      deviceIdentifier: deviceId,
    });

    if (hasVoted) {
      return res.status(400).json({ error: "Already voted from this device" });
    }

    // Update the vote count
    const result = await Vote.findByIdAndUpdate(
      req.params.id,
      {
        $inc: {
          count: 1,
        },
      },
      { new: true, useFindAndModify: false }
    );

    // Add the deviceIdentifier if not voted yet
    if (!result) {
      const newVote = new Vote({
        _id: req.params.id,
        count: 1,
        deviceIdentifier: deviceId,
      });

      await newVote.save();
    } else {
      // Update the deviceIdentifier for all votes
      await Vote.updateMany(
        {},
        { $set: { deviceIdentifier: deviceId } },
        { multi: true }
      );
    }

    res.status(200).json({ message: "Vote was updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "There was a server-side error!" });
  }
});

module.exports = router;
