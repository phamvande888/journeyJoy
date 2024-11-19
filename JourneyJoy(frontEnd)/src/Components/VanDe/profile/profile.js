import React, { useEffect, useState } from "react";
import "./profile.css";
import Header from "../homePage/header/header";
import Footer from "../homePage/footer/footer";
import { useNavigate } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  notifySuccess,
  notifyError,
  notifyInfo,
  notifyWarn,
} from "../notify/Notify";
import { URL_SERVER } from "../server";

const Profile = () => {
  const navigate = useNavigate(); //navigate page

  // user info
  const [username, setUsername] = useState("");
  const [ho_ten, setHo_ten] = useState("");
  const [gioi_tinh, setGioi_tinh] = useState("");
  const [email, setEmail] = useState("");
  const [dia_chi, setDia_chi] = useState("");
  const [sdt, setSdt] = useState("");

  // user change password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // icon show password
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showNotify, setShowNotify] = useState(false);

  //  -------API GET data Profile------
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token"); //get token from localstore
    // console.log("Token from localStorage:", token);
    try {
      const response = await fetch(`${URL_SERVER}/account`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error data:", errorData);
        return;
      }
      const data = await response.json();
      console.log("Data user:", data);
      setUsername(data.username);
      setSdt(data.sdt);
      setHo_ten(data.ho_ten);
      setGioi_tinh(data.gioi_tinh);
      setDia_chi(data.dia_chi);
      setEmail(data.email);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  // useEffect fetch UserProfile
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // scroll
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  //  ---- Logout ----
  const handleLogOut = () => {
    localStorage.removeItem("token"); //remove token
    localStorage.removeItem("localUserID"); //remove id user
    notifySuccess("LogOut success");
    //after 1s move to home page
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  // ------------ API POST Update Profile user ---------
  const handleUpdate = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const updatedProfile = {
      ho_ten,
      gioi_tinh,
      email,
      dia_chi,
      sdt,
    };
    try {
      const response = await fetch(`${URL_SERVER}/updateAccount`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify(updatedProfile),
      });
      if (response.ok) {
        const responseData = await response.json();
        // const { token: newToken, user: updatedUser } = responseData;

        const { token: newToken } = responseData;
        localStorage.setItem("token", newToken);
        notifySuccess("Profile updated successfully!");
        fetchUserProfile();
      } else {
        const errorData = await response.json();
        // console.error("Error updating profile:", errorData);
        notifyError(`Error updating profile: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      notifyError(`Error updating profile: ${error.message}`);
    }
  };

  // ------------ API POST change Password user -----------
  const handlePasswordChange = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (newPassword !== confirmNewPassword) {
      notifyError("New passwords do not match!");
      return;
    }
    const passwordData = {
      oldPassword,
      newPassword,
    };
    try {
      const response = await fetch(`${URL_SERVER}/changePassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify(passwordData),
      });
      if (response.ok) {
        notifySuccess("Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        const errorData = await response.json();
        console.error("Error changing password:", errorData);
        notifyError(`Error changing password: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      notifyError(`Error changing password: ${error.message}`);
    }
  };

  // click img profile
  const handleClickProfile = () => {
    navigate("/profile");
  };

  return (
    <div>
      <Header />
      <div className="profile__root">
        <div className="profile__container">
          <div className="profile__container--top">
            <h1>Journey Joy Hello {ho_ten} !!!</h1>
          </div>

          <div className="profile__container--left">
            <div className="card__profile">
              <div onClick={handleClickProfile} className="profile__img">
                <img src="profile.jpg" alt="Profile" />
              </div>

              <div
                className="profile__icon notify"
                onClick={() => setShowNotify(!showNotify)}
              >
                <i className="fa-solid fa-envelope"></i>
                <h5>Notifications</h5>
              </div>

              <div
                className="profile__icon"
                onClick={() => setShowChangePassword(!showChangePassword)}
              >
                <i className="fa-solid fa-key"></i>
                <h5>Change Password</h5>
              </div>

              <div className="profile__icon" onClick={handleLogOut}>
                <i className="fa-solid fa-right-from-bracket"></i>
                <h5>LogOut</h5>
              </div>
            </div>
          </div>

          <div className="profile__container--right">
            <form onSubmit={handleUpdate}>
              <div className="form__wraper">
                <div className="form__wraper--infor">
                  <div>
                    <h3>Profile Details</h3>
                  </div>

                  <div className="form__wraper--infor-fullname">
                    <div className="form__wraper--infor-first">
                      <label className="lable">Full Name</label>
                      <br></br>
                      <input
                        type="text"
                        value={ho_ten}
                        onChange={(e) => setHo_ten(e.target.value)}
                      />
                    </div>

                    <div className="form__wraper--infor-first">
                      <label className="lable">Gender</label>
                      <br></br>
                      <select
                        value={gioi_tinh}
                        onChange={(e) => setGioi_tinh(e.target.value)}
                        style={{
                          width: "200px",
                          backgroundColor: "rgb(208, 205, 205)",
                        }}
                      >
                        <option value={"Male"}>Male</option>
                        <option value={"FeMale"}>Female</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form__wraper--infor">
                  <div>
                    <h3>Contact Details</h3>
                  </div>

                  <div className="form__wraper--infor-fullname">
                    <div className="form__wraper--infor-first">
                      <label className="lable">Phone Number</label>
                      <br></br>
                      <input onlyre type="text" value={sdt} readOnly />
                    </div>

                    <div className="form__wraper--infor-first">
                      <label className="lable">Address</label>
                      <br></br>
                      <input
                        type="text"
                        value={dia_chi}
                        onChange={(e) => setDia_chi(e.target.value)}
                      />
                    </div>
                    <div className="form__wraper--infor-first">
                      <label className="lable">Email</label>
                      <br></br>
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ minWidth: "280px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="twobtn">
                <div className="profile__button">
                  <button className="btnupdate" type="submit">
                    Update
                  </button>
                </div>
              </div>
            </form>

            {showChangePassword && (
              <form onSubmit={handlePasswordChange}>
                <div className="form__wraper">
                  <div className="form__wraper--infor">
                    <div>
                      <h3>Change Password</h3>
                    </div>

                    <div className="form__wraper--infor-fullname">
                      <div className="form__wraper--infor-first">
                        <label className="lable">Current Password</label>
                        <br></br>
                        <input
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                        />
                      </div>

                      <div className="form__wraper--infor-first">
                        <label className="lable">New Password</label>
                        <br></br>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>

                      <div className="form__wraper--infor-first">
                        <label className="lable">Confirm New Password</label>
                        <br></br>
                        <input
                          type="password"
                          value={confirmNewPassword}
                          onChange={(e) =>
                            setConfirmNewPassword(e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="twobtn">
                  <div className="profile__button">
                    <button className="btnupdate" type="submit">
                      Change Password
                    </button>
                  </div>
                </div>
              </form>
            )}
            {showNotify && (
              <form>
                <div className="form__wraper">
                  <div className="form__wraper--infor">
                    <div>
                      <h3>Notifications</h3>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default Profile;
