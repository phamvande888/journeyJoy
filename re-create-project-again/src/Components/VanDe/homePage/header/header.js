import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./header.css";
import { URL_SERVER } from "../../server";
import logo from "./logo1.png";

const Header = () => {
  const url = URL_SERVER; //link ngrok
  const navigate = useNavigate(); //native page
  const [ten_tour, setTen_tour] = useState(""); //state input search
  const isLoggedIn = Boolean(localStorage.getItem("token")); // check login

  // if logged native to profile, else move to login
  const handleProfileClick = () => {
    navigate(isLoggedIn ? "/profile" : "/login");
  };

  // set state for SearchInput
  const handleSearchChange = (e) => {
    setTen_tour(e.target.value);
  };

  // call API --> SEARCH TOUR
  const handleSearchClick = () => {
    fetch(`${url}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ten_tour }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("---kết qủa search ---", data);
        navigate("/alltour", { state: { dataSearch: data } }); // sotre data search then pass data to all tour page
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
      });
  };

  return (
    <div className="header__root">
      <div className="header">
        <div className="header__logoAndSearch">
          <div className="header__logo">
            <a href="/" className="logo">
              Journey<span>JOY</span>
            </a>
          </div>
          <div className="header__search">
            <span className="header__search--iconSearch">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
            <input
              className="header__search--input"
              placeholder="Find the places you want to go"
              value={ten_tour}
              onChange={handleSearchChange}
            />
            <button className="buttonClicked" onClick={handleSearchClick}>
              Search
            </button>
          </div>
        </div>
        {isLoggedIn ? (
          <div className="header__listItems">
            <ul>
              <li>
                <a href="/news">
                  <i class="fa-solid fa-newspaper"></i>
                </a>
                <div className="icontitle">News</div>
              </li>
              <li>
                <a href="/contact">
                  <i className="fa-solid fa-handshake-angle"></i>
                </a>
                <div className="icontitle">Contact</div>
              </li>
              <li>
                <a href="/wishlist">
                  <i className="fa-solid fa-heart"></i>
                </a>
                <div className="icontitle">Wishlist</div>
              </li>
              <li>
                <a href="/Booking">
                  <i className="fa-solid fa-ticket"></i>
                </a>
                <div className="icontitle">Bookings</div>
              </li>
              <li>
                <div onClick={handleProfileClick}>
                  <a href="">
                    <i className="fa-solid fa-user"></i>
                  </a>
                </div>
                <div className="icontitle">Profile</div>
              </li>
            </ul>
          </div>
        ) : (
          <div className="header__listItems">
            <ul>
              <li style={{ paddingLeft: "300px" }}>
                <div onClick={handleProfileClick}>
                  <a href="">
                    <i className="fa-solid fa-right-to-bracket"></i>
                  </a>
                </div>
                <div className="icontitle">LogIn</div>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
