import nodemailer from "nodemailer";

let transporter;
let previewUrl = "";

export const createTransporter = async () => {
  const testAccount = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  console.log("Ethereal Email Account Created");
};

export const sendMail = async (options) => {
  if (!transporter) {
    await createTransporter();
  }

  const info = await transporter.sendMail(options);

  previewUrl = nodemailer.getTestMessageUrl(info);

  console.log("Preview URL:", previewUrl);

  return previewUrl;
};