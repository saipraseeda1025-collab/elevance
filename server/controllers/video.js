import video from "../Modals/video.js";
import User from "../Modals/Auth.js";

export const uploadvideo = async (req, res) => {
  if (req.file === undefined) {
    return res
      .status(404)
      .json({ message: "plz upload a mp4 video file only" });
  } else {
    try {
      const file = new video({
        videotitle: req.body.videotitle,
        filename: req.file.originalname,
        filepath: req.file.path,
        filetype: req.file.mimetype,
        filesize: req.file.size,
        videochanel: req.body.videochanel,
        uploader: req.body.uploader,
      });
      await file.save();
      return res.status(201).json("file uploaded successfully");
    } catch (error) {
      console.error(" error:", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
};
export const getallvideo = async (req, res) => {
  try {
    const files = await video.find();
    return res.status(200).send(files);
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const downloadVideo = async (req, res) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Unlimited downloads for Gold
    if (
      user.subscriptionPlan !== "Gold" &&
      user.downloadCount >= user.videoLimit
    ) {
      return res.status(403).json({
        success: false,
        message: "Download limit reached. Upgrade your subscription.",
      });
    }

    const selectedVideo = await video.findById(id);

    if (!selectedVideo) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    // Increase download count
    user.downloadCount += 1;
    user.lastDownloadDate = new Date();

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Download allowed",
      filePath: selectedVideo.filepath,
      remaining:
        user.subscriptionPlan === "Gold"
          ? "Unlimited"
          : user.videoLimit - user.downloadCount,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
