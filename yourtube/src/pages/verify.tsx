import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosinstance";

export default function Verify() {
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  useEffect(() => {
    const state = localStorage.getItem("userState");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const sendOtp = async () => {
      if (
        state === "Tamil Nadu" ||
        state === "Kerala" ||
        state === "Karnataka" ||
        state === "Andhra Pradesh" ||
        state === "Telangana"
      ) {
        try {
          const res = await axiosInstance.post("/otp/send", {
            email: user.email,
          });

          setGeneratedOtp(res.data.otp.toString());

          alert("✅ Email OTP Sent");
        } catch (err) {
          console.log(err);
        }
      } else {
        const otp = Math.floor(
          100000 + Math.random() * 900000
        ).toString();

        setGeneratedOtp(otp);

        alert(" OTP : " + otp);
      }
    };

    sendOtp();
  }, []);

  const verify = () => {
    if (otp === generatedOtp) {
      alert("✅ Account Verified");

      localStorage.setItem("otpVerified", "true");
    } else {
      alert("Wrong OTP");
    }
  };


    return (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white rounded-xl shadow-lg p-8 w-[420px]">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">🔐 Verify Your Account</h1>
        <p className="text-gray-500 mt-2">
          Enter the OTP sent to your registered email/mobile.
        </p>
      </div>

      <input
        type="text"
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
      />

      <button
        onClick={verify}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold"
      >
        Verify OTP
      </button>

      <p className="text-center text-sm text-gray-500 mt-4">
        Didn't receive OTP?
      </p>

      <button
        onClick={() => window.location.reload()}
        className="w-full mt-2 border border-red-600 text-red-600 py-2 rounded-lg hover:bg-red-50"
      >
        Resend OTP
      </button>
    </div>
  </div>

    
  );
}