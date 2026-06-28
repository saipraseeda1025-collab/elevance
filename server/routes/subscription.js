import express from "express";
import {
  changePlan,
  createOrder,
  verifyPayment
} from "../controllers/subscription.js";

const router = express.Router();

router.post("/changePlan", changePlan);
router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);

export default router;