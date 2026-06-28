import { sendMail } from "../utils/email.js";

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000);

    const preview = await sendMail({
      from: '"YourTube" <no-reply@yourtube.com>',
      to: email,
      subject: "YourTube Login OTP",
      html: `
        <h2>YourTube Login OTP</h2>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    res.json({
      success: true,
      otp,
      preview,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "OTP sending failed",
    });
  }
};