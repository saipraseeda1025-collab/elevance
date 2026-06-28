import { useState } from "react";

interface OTPDialogProps {
  open: boolean;
  otp: number;
  title: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function OTPDialog({
  open,
  otp,
  title,
  onSuccess,
  onClose,
}: OTPDialogProps) {
  const [value, setValue] = useState("");

  if (!open) return null;

  const verify = () => {
    if (value === otp.toString()) {
      alert("OTP Verified Successfully");
      onSuccess();
      onClose();
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "white",
          padding: 30,
          borderRadius: 12,
          width: 350,
        }}
      >
        <h2>{title}</h2>

        <p style={{ marginTop: 10 }}>
          Enter the OTP sent to you.
        </p>

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter OTP"
          style={{
            width: "100%",
            padding: 10,
            marginTop: 15,
          }}
        />

        <button
          onClick={verify}
          style={{
            marginTop: 20,
            width: "100%",
            padding: 10,
            cursor: "pointer",
          }}
        >
          Verify OTP
        </button>

        <button
          onClick={onClose}
          style={{
            marginTop: 10,
            width: "100%",
            padding: 10,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}