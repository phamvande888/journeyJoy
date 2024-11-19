import React from "react";
import { Route, Routes } from "react-router-dom";
import "./homePage.css";
import Header from "./header/header.js";
import Footer from "./footer/footer.js";
import Banner from "./banner/banner.js";
import AllTour from "../tours/allTour";
import Profile from "../profile/profile.js";
import Login from "../login/login.js";
import TourDetail from "../tours/detail/tourDetail.js";
import TopTours from "../tours/topTour/TopTours.js";
import NewTours from "../tours/NewTours/NewTours.js";
import Filter from "./filter/Filter.js";
import Domestic from "../tours/DomesticTour.js";
import Foreign from "../tours/ForeignTour.js";
import { useEffect, useState } from "react";
// toast
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  notifySuccess,
  notifyError,
  notifyInfo,
  notifyWarn,
} from "../notify/Notify.js";
//server URL https://mustang-whole-mentally.ngrok-free.app
import { URL_SERVER } from "../server.js";
import PostListCustomerPage from "../../Quang/PostListCustomerPage/PostListCustomerPage.js";

const HomePage = () => {
  const [user, setUser] = useState([]);

  const url = URL_SERVER;
  // Call API data Profile
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${url}/account`, {
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
      // console.log("Data user:", data);
      setUser(data);
      localStorage.setItem("localUserID", data.id);
      // console.log(localStorage.getItem("localUserID"));
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // useEffect fetch UserProfile
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Inject Tawk.to Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://embed.tawk.to/670ccff34304e3196ad13ba1/1ia50oknu";
    script.async = true;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <Header />
      <Banner />
      <Filter />
      {/* <PostListCustomerPage /> */}
      <Domestic user={user} />
      <Foreign user={user} />
      <AllTour user={user} />
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default HomePage;
