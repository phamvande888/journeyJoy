import React, { useState } from "react";
import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "./firebase.config.js";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
// import style from "./customOTPStyles.module.css"; // Custom CSS for additional styles if needed

const OTP = () => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        }
      );
    }
  }

  function onSignup() {
    setLoading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;
    console.log("LOG BUTTON", window.recaptchaVerifier);
    const formatPh = "+" + ph;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sent successfully!");
      })
      .catch((error) => {
        console.log("LOG ERROR LINE 52", error);
        setLoading(false);
      });
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  return (
    <section className="bg-primary d-flex align-items-center justify-content-center vh-100">
      <div>
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        {user ? (
          <h2 className="text-center text-white fw-medium fs-2">
            👍 Login Success
          </h2>
        ) : (
          <div className="w-100 d-flex flex-column gap-3 rounded-lg p-4 bg-light">
            <h1 className="text-center text-primary fw-medium fs-1 mb-4">
              Welcome to <br /> CODE A PROGRAM
            </h1>
            {showOTP ? (
              <>
                <div className="bg-white text-primary mx-auto p-3 rounded-circle">
                  <BsFillShieldLockFill size={30} />
                </div>
                <label
                  htmlFor="otp"
                  className="fw-bold fs-4 text-primary text-center"
                >
                  Enter your OTP
                </label>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  autoFocus
                  className="otp-container"
                ></OtpInput>
                <button
                  onClick={onOTPVerify}
                  className="btn btn-primary w-100 d-flex gap-2 align-items-center justify-content-center py-2"
                >
                  {loading && <CgSpinner size={20} className="animate-spin" />}
                  <span>Verify OTP</span>
                </button>
              </>
            ) : (
              <>
                <div className="bg-white text-primary mx-auto p-3 rounded-circle">
                  <BsTelephoneFill size={30} />
                </div>
                <label
                  htmlFor=""
                  className="fw-bold fs-4 text-primary text-center"
                >
                  Verify your phone number
                </label>
                <PhoneInput
                  country={"vn"}
                  value={ph}
                  onChange={setPh}
                  inputStyle={{ width: "100%" }}
                />
                <button
                  onClick={onSignup}
                  className="btn btn-primary w-100 d-flex gap-2 align-items-center justify-content-center py-2"
                >
                  {loading && <CgSpinner size={20} className="animate-spin" />}
                  <span>Send code via SMS</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default OTP;
