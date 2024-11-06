import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./login.css";
import OTP from "./otp";
// toast
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  notifySuccess,
  notifyError,
  notifyInfo,
  notifyWarn,
} from "../notify/Notify";
import { URL_SERVER } from "../server.js";

const Login = () => {
  const navigate = useNavigate(); //goto next page

  // useState for Sign Up
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmSignUpPassword, setConfirmSignUpPassword] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmSignUpPassword, setShowConfirmSignUpPassword] =
    useState(false);
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [username, seUsername] = useState("");

  // useState for Sign In
  const [signInPhone, setSignInPhone] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signInRole, setSignInRole] = useState("");

  // useState for Forgot Password
  const [forgotEmail, setForgotEmail] = useState("");

  // state for errors
  const [errors, setErrors] = useState({
    signUp: "",
    signIn: "",
    forgotPassword: "",
  });

  const [isResettingPassword, setIsResettingPassword] = useState(false);

  //slide form login
  useEffect(() => {
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("container");

    const handleSignUpClick = () => {
      container.classList.add("right-panel-active");
    };

    const handleSignInClick = () => {
      container.classList.remove("right-panel-active");
    };

    if (signUpButton && signInButton && container) {
      signUpButton.addEventListener("click", handleSignUpClick);
      signInButton.addEventListener("click", handleSignInClick);
    }

    return () => {
      if (signUpButton && signInButton) {
        signUpButton.removeEventListener("click", handleSignUpClick);
        signInButton.removeEventListener("click", handleSignInClick);
      }
    };
  }, []);

  // đăng ký thành công trượt về login
  const handleSignInClick = () => {
    const container = document.getElementById("container");
    if (container) {
      container.classList.remove("right-panel-active");
    }
  };

  // check mail
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  //check Phone
  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  //check PassWord
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // ----------------------API Sign Up-------------------
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!validatePhone(signUpPhone)) {
      setErrors({ ...errors, signUp: "Invalid phone number." });
      return;
    }
    if (!validatePassword(signUpPassword)) {
      setErrors({
        ...errors,
        signUp: "Password must be at least 8 characters.",
      });
      return;
    }
    if (signUpPassword !== confirmSignUpPassword) {
      setErrors({ ...errors, signUp: "Passwords do not match." });
      return;
    }
    if (!validateEmail(email)) {
      setErrors({ ...errors, signUp: "Invalid email format." });
      return;
    }
    setErrors({ ...errors, signUp: "" });

    try {
      const response = await fetch(`${URL_SERVER}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({
          username,
          ho_ten: fullName,
          password: signUpPassword,
          email,
          gioi_tinh: gender,
          dia_chi: address,
          sdt: signUpPhone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors({ ...errors, signUp: "SignUp fail!!" });
        setErrors({ ...errors, signUp: errorData.message });
      } else {
        const data = await response.json();
        console.log(data);
        notifySuccess(data.message);
        setTimeout(() => {
          handleSignInClick();
        }, 1000);
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      setErrors({
        ...errors,
        signUp: error.message,
      });
    }
  };

  // ------------------------API SignIn-------------------
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (!validatePhone(signInPhone)) {
      setErrors({ ...errors, signIn: "Incorrect phone number or password!!!" });
      // notifyError("Incorrect phone number or password!!!");
      return;
    }
    if (!validatePassword(signInPassword)) {
      setErrors({ ...errors, signIn: "Incorrect phone number or password!!!" });
      // notifyError("Incorrect phone number or password!!!");
      return;
    }
    setErrors({ ...errors, signIn: "" });

    try {
      const response = await fetch(`${URL_SERVER}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({
          sdt: signInPhone,
          password: signInPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors({ ...errors, signIn: errorData.message });
        localStorage.clear(); // remove token
      } else {
        const data = await response.json();
        console.log("DATA================", data);
        localStorage.setItem("token", data.token); // Save token
        notifySuccess("Logged in successfully");
        setTimeout(() => {
          navigate("/");
        }, 800); // Thay đổi 2000 thành khoảng thời gian bạn muốn (tính bằng milliseconds)
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrors({
        ...errors,
        signIn: "Incorrect user or password, please try again later.",
      });
      // notifyError("Incorrect user or password, please try again later.");
    }
  };

  // -------------------------------------------API forgot------------------------------
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(forgotEmail)) {
      setErrors({ ...errors, forgotPassword: "Invalid email format." });
      return;
    }
    try {
      const response = await fetch(`${URL_SERVER}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({
          email: forgotEmail,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors({ ...errors, forgotPassword: errorData.message });
      } else {
        const data = await response.json();
        console.log("DATA================", data);
        notifySuccess("Password reset email sent successfully.");
        //success then  back to login
        setTimeout(() => {
          setIsResettingPassword(false);
        }, 1000);
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      setErrors({
        ...errors,
        forgotPassword: "Error during password reset, please try again later.",
      });
    }
  };

  return (
    <div id="login__root">
      <div className="body__login">
        <div className="button__Exit">
          <button onClick={() => navigate("/")}>
            <FontAwesomeIcon icon={faTimes} className="iconnn" />
          </button>
        </div>

        <div className="container" id="container">
          <div className="button__Exit"></div>
          <div className="form-container sign-up-container">
            <form onSubmit={handleSignUpSubmit}>
              {/* <h1>Create Account</h1> */}

              <h5>Fill in your information</h5>
              <input
                type="tel"
                placeholder="Phone number"
                value={signUpPhone}
                onChange={(e) => setSignUpPhone(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="password-container">
                <input
                  type={showSignUpPassword ? "text" : "password"}
                  placeholder="Password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  required
                />
                <FontAwesomeIcon
                  icon={showSignUpPassword ? faEyeSlash : faEye}
                  onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                  className="password-toggle-icon"
                />
              </div>
              <div className="password-container">
                <input
                  type={showConfirmSignUpPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmSignUpPassword}
                  onChange={(e) => setConfirmSignUpPassword(e.target.value)}
                  required
                />
                <FontAwesomeIcon
                  icon={showConfirmSignUpPassword ? faEyeSlash : faEye}
                  onClick={() =>
                    setShowConfirmSignUpPassword(!showConfirmSignUpPassword)
                  }
                  className="password-toggle-icon"
                />
              </div>
              <div className="checkbox">
                <input
                  type="checkbox"
                  className="checkbox--box"
                  required
                ></input>
                <p>Create and agree to the terms</p>
              </div>
              {errors.signUp && <p className="error">{errors.signUp}</p>}
              <button type="submit">Sign Up</button>
            </form>
          </div>

          <div className="form-container sign-in-container">
            {isResettingPassword ? (
              <form onSubmit={handleForgotSubmit}>
                <h1>Forgot Password</h1>
                <p>Enter your mail here</p>
                <input
                  type="email"
                  placeholder="Email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
                {errors.forgotPassword && (
                  <p className="error">{errors.forgotPassword}</p>
                )}
                <div style={{ display: "flex", paddingTop: "20px" }}>
                  <button
                    type="button"
                    className="backButton"
                    onClick={() => setIsResettingPassword(false)}
                  >
                    Back
                  </button>
                  <button className="backButton" onClick={handleForgotSubmit}>
                    Forgot
                  </button>
                </div>
              </form>
            ) : (
              // In
              <form onSubmit={handleSignInSubmit}>
                <h1>Sign in</h1>
                <span>use your account</span>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={signInPhone}
                  onChange={(e) => setSignInPhone(e.target.value)}
                  required
                />
                <div className="password-container">
                  <input
                    type={showSignInPassword ? "text" : "password"}
                    placeholder="Password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    required
                  />
                  <FontAwesomeIcon
                    icon={showSignInPassword ? faEyeSlash : faEye}
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="password-toggle-icon"
                  />
                </div>
                {errors.signIn && <p className="error">{errors.signIn}</p>}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsResettingPassword(true);
                  }}
                >
                  Forgot your password?
                </a>
                <button type="submit">Sign In</button>
              </form>
            )}
          </div>

          {/* left */}
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Welcome Back!</h1>
                <p>
                  To keep connected with us please login with your personal info
                </p>
                <button className="ghost" id="signIn">
                  Sign In
                </button>
              </div>

              <div className="overlay-panel overlay-right">
                <h1>Journey Joy Hello!</h1>
                <p>Enter your personal details and start journey with us</p>
                <button className="ghost" id="signUp">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
