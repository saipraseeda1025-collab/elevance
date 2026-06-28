import comment from "../Modals/comment.js";
import mongoose from "mongoose";

export const postcomment = async (req, res) => {
  const { commentbody } = req.body;

  // Check empty comment
  if (!commentbody || commentbody.trim() === "") {
    return res.status(400).json({
      message: "Comment cannot be empty",
    });
  }

  // Allow only letters, numbers and spaces
  const regex = /^[a-zA-Z0-9\s]+$/;

  if (!regex.test(commentbody)) {
    return res.status(400).json({
      message: "Special characters are not allowed.",
    });
  }

  const postcomment = new comment(req.body);

  try {
    await postcomment.save();
    return res.status(200).json({
      comment: true,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getallcomment = async (req, res) => {
  const { videoid } = req.params;

  try {
    const commentvideo = await comment.find({ videoid });

    return res.status(200).json(commentvideo);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const deletecomment = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("Comment unavailable");
  }

  try {
    await comment.findByIdAndDelete(_id);

    return res.status(200).json({
      comment: true,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const editcomment = async (req, res) => {
  const { id: _id } = req.params;
  const { commentbody } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("Comment unavailable");
  }

  // Check empty comment
  if (!commentbody || commentbody.trim() === "") {
    return res.status(400).json({
      message: "Comment cannot be empty",
    });
  }

  // Allow only letters, numbers and spaces
  const regex = /^[a-zA-Z0-9\s]+$/;

  if (!regex.test(commentbody)) {
    return res.status(400).json({
      message: "Special characters are not allowed.",
    });
  }

  try {
    const updatecomment = await comment.findByIdAndUpdate(
      _id,
      {
        $set: {
          commentbody,
        },
      },
      { new: true }
    );

    return res.status(200).json(updatecomment);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};
export const likeComment = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedComment = await comment.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    return res.status(200).json(updatedComment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const dislikeComment = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedComment = await comment.findByIdAndUpdate(
      id,
      { $inc: { dislikes: 1 } },
      { new: true }
    );

    // Auto delete after 2 dislikes
    if (updatedComment.dislikes >= 2) {
      await comment.findByIdAndDelete(id);

      return res.status(200).json({
        deleted: true,
        message: "Comment deleted due to 2 dislikes",
      });
    }

    return res.status(200).json(updatedComment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};