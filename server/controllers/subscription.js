
import { sendMail } from "../utils/email.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();
import User from "../Modals/Auth.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const changePlan = async (req, res) => {

    try {

        if (!req.body) {
    return res.status(400).json({
        message: "Request body is missing"
    });
}

const { userId, plan } = req.body;
        let limit = 10;
        let premium = false;

        if (plan === "Bronze") {
            limit = 30;
            premium = true;
        }

        if (plan === "Silver") {
            limit = 60;
            premium = true;
        }

        if (plan === "Gold") {
            limit = 99999;
            premium = true;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                subscriptionPlan: plan,
                premium,
                videoLimit: limit
            },
            { new: true }
        );

        res.status(200).json(updatedUser);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // Razorpay uses paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Unable to create Razorpay order"
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      plan
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(
        razorpay_order_id + "|" + razorpay_payment_id
      )
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }

    let limit = 10;
    let premium = false;

    if (plan === "Bronze") {
      limit = 30;
      premium = true;
    }

    if (plan === "Silver") {
      limit = 60;
      premium = true;
    }

    if (plan === "Gold") {
      limit = 99999;
      premium = true;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        subscriptionPlan: plan,
        premium,
        videoLimit: limit
      },
      { new: true }
    );
    try {
  let amount = 0;

  if (plan === "Bronze") amount = 10;
  if (plan === "Silver") amount = 50;
  if (plan === "Gold") amount = 100;

  const invoiceId = "INV-" + Date.now();

  const preview = await sendMail({
    from: '"YourTube" <no-reply@yourtube.com>',
    to: updatedUser.email,
    subject: "YourTube Premium Invoice",
    html: `
      <h2>Payment Successful</h2>

      <p><strong>Invoice:</strong> ${invoiceId}</p>

      <p><strong>Name:</strong> ${updatedUser.name}</p>

      <p><strong>Email:</strong> ${updatedUser.email}</p>

      <p><strong>Plan:</strong> ${plan}</p>

      <p><strong>Amount:</strong> ₹${amount}</p>

      <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>

      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>

      <hr>

      <h3>Thank you for subscribing to YourTube Premium!</h3>
    `,
  });

  console.log("Invoice Preview:", preview);
} catch (mailError) {
  console.log("Invoice Email Error:", mailError);
}

    res.status(200).json({
      success: true,
      user: updatedUser
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Verification failed"
    });
  }
};