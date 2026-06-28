import express from "express";
import {
  getallvideo,
  uploadvideo,
  downloadVideo,
} from "../controllers/video.js";
import upload from "../filehelper/filehelper.js";

const routes = express.Router();

routes.post("/upload", upload.single("file"), uploadvideo);

routes.get("/getall", getallvideo);

// NEW DOWNLOAD ROUTE
routes.post("/download/:id", downloadVideo);

export default routes;