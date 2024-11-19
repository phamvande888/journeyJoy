import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import "./login.css"; // Make sure this CSS file includes the new styles
import { URL_SERVER } from "../../VanDe/server";
const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

  function GetURLPath() {
    const urlPath = useLocation();
    console.log("urlPath>>>>>>>>>>>>>>", urlPath);
    return urlPath.pathname;
  }

  let path = GetURLPath();

  const handleSignInSubmit = async (e) => {
    localStorage.clear();
    e.preventDefault();
    try {
      let loginPath = "";
      if (path.includes("/admin/login")) {
        loginPath = `${URL_SERVER}/api/auth/login`;
      } else if (path.includes("tourguide/login")) {
        loginPath = `${URL_SERVER}/tourguide/login`;
      }
      const response = await fetch(loginPath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({
          sdt: username,
          password: password,
        }),
      });
      if (!response.ok) {
        localStorage.clear();
      }
      const data = await response.json();
      console.log("DATA================", data);
      alert("Login successful");
      localStorage.setItem("token", data.token); // Save token
      console.log("<<<<TOKEN LOGIN>>>>", localStorage.getItem("token"));
      if (path.includes("/admin/login")) {
        navigate("/admin");
      } else if (path.includes("tourguide/login")) {
        navigate("/tourguide");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-content">
          <div className="login-header">
            {/* <img src="" alt="Journey Joy" className="logo" /> */}
            <p className="logo">Journey Joy</p>
            <h1>Đăng nhập vào hệ thống</h1>
          </div>
          <form className="login-form" onSubmit={handleSignInSubmit}>
            <input
              className="login-input"
              id="username"
              type="text"
              placeholder="Tên người dùng"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="password-field">
              <input
                className="login-input"
                id="password"
                type={showPassword ? "text" : "password"} // Toggle between text and password
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button className="login-button" type="submit">
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;