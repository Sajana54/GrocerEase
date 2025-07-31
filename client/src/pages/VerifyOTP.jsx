import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isComplete, setIsComplete] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef([]);

  const navigate = useNavigate();
 const tempUser = JSON.parse(localStorage.getItem("tempUser"));

 const { name, email, password } = tempUser || {};

 

  useEffect(() => {
    if (!name || !email || !password) {
   toast.error("Missing registration data. Please sign up again.");
   navigate("/");

 // Prevent direct access
    }
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleInputChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    setIsComplete(newOtp.every((digit) => digit !== ""));
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0, 6);
    if (digits.length === 6) {
      const newOtp = digits.split("");
      setOtp(newOtp);
      setIsComplete(true);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    const enteredOtp = otp.join("");

    try {
      const res = await axios.post("/api/user/verify-otp", {
        name,
        email,
        password,
        otp: enteredOtp,
      });

      if (res.data.success) {
        setIsVerified(true);
      } else {
        toast.error(res.data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setResendTimer(300);
    setOtp(["", "", "", "", "", ""]);
    setIsComplete(false);
    setIsVerified(false);
    inputRefs.current[0]?.focus();

    try {
      const res = await axios.post("/api/user/register-temp", {
        name,
        email,
        password,
      });

      if (!res.data.success) {
        toast.error("Failed to resend OTP. Try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while resending OTP.");
    }
  };

  const handleBack = () => {
  navigate("/verify-otp", {
    state: { name, email, password },
  });


  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md text-center border border-white/20 shadow-2xl">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Verification Successful!
            </h2>
            <p className="text-white/80">
              Your account has been verified successfully.
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md relative border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={handleBack}
            className="absolute top-6 left-6 p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-purple-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            Verify Your Account
          </h1>
          <p className="text-white/80 text-sm mb-1">
            We've sent a 6-digit code to your email
          </p>
          <p className="text-white/60 text-sm">{email}</p>
        </div>

        {/* OTP Input Fields */}
        <div className="mb-8">
          <div className="flex justify-center space-x-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-12 h-14 text-center text-xl font-bold bg-white/20 border-2 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 ${
                  digit
                    ? "border-purple-400 bg-white/30 shadow-lg"
                    : "border-white/30"
                } ${isComplete ? "animate-pulse" : ""}`}
                placeholder="0"
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={!isComplete || isVerifying}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform ${
              isComplete && !isVerifying
                ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105 shadow-lg"
                : "bg-white/20 cursor-not-allowed"
            }`}
          >
            {isVerifying ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Verifying...</span>
              </div>
            ) : (
              "Verify Code"
            )}
          </button>
        </div>

        {/* Resend Code */}
        <div className="text-center">
          <p className="text-white/60 text-sm mb-2">Didn't receive the code?</p>
          {resendTimer > 0 ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-purple-400 rounded-full animate-spin"></div>
              <p className="text-white/80 text-sm">
                Resend code in {resendTimer}s
              </p>
            </div>
          ) : (
            <button
              onClick={handleResend}
              className="text-purple-400 hover:text-purple-300 font-semibold text-sm transition-colors hover:underline"
            >
              Resend Code
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
