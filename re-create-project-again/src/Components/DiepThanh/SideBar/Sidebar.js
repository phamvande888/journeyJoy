import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Routes, Route, Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Sidebar.css";
import SearchBooking from "../../Quang/booking/SearchBooking";
import User from "../../Quang/UserAccount/User";
import PostedList from "../../Quang/PostedList/PostedList";
import Comment from "../../Quang/Comment/Comment";
import PersonalProfile from "../../Quang/profile/ProfileAdminSite";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import i18n from "../i18n/i18n";
import ContactList from "../Contacts/contact";
import Statistics from "../Statistics/statistics";
// import ListTour from "../../Quang/ListTour/ListTour";
// import ListTourBookingModal from "../../Quang/ListTour/ListTourBookingModal";
// import CreateTourModal from "../../Quang/ListTour/CreateTour";
// import UserList from "./Components/Quang/UserAccount/User";

const Sidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    // Retrieve collapse state from local storage or default to false
    return JSON.parse(localStorage.getItem("sidebarCollapsed")) || false;
  });

  useEffect(() => {
    // Check if user is authenticated when component mounts
    if (!localStorage.getItem("token")) {
      navigate("/admin/login"); // Redirect to login if not authenticated
    }
  }, [navigate]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear local storage
    navigate("/admin/login"); // Redirect to login page
  };

  const isAuthenticated = !!localStorage.getItem("token"); // Check if user is authenticated

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />; // Redirect to login if not authenticated
  }

  const handleCollapse = () => {
    const newCollapseState = !collapsed;
    setCollapsed(newCollapseState);
    localStorage.setItem("sidebarCollapsed", JSON.stringify(newCollapseState)); // Save collapse state to local storage
  };

  return (
    <div className={`sidebar-container ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar">
        <div className={`sidebar-logo ${collapsed ? "d-none" : ""}`}>
          <h1>{t("welcome")}</h1>
        </div>
        <div className="sidebar-content">
          {location.pathname.includes("/admin") ? (
            <div className="sidebar-section">
              <div className={`d-flex justify-content-around ${collapsed ? "d-none" : ""}`}>
                <h2>{t("adminSection")}</h2>
                <div className="d-flex">
                  <i style={{ marginTop: 1.5, fontSize: "x-large" }} className="far fa-language"></i>
                  <LanguageSwitcher changeLanguage={changeLanguage} />
                </div>
              </div>
              <ul>
                <li>
                  <Link to="/admin/listtour">
                    <div className="sidebar-item">
                      <i className="fa-solid fa-list"></i>
                      <span className={`sidebar-text ${collapsed ? "d-none" : ""}`}>{t("ListTour")}</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/admin/tourbooked">
                    <div className="sidebar-item">
                      <i className="fas fa-calendar-check"></i>
                      <span className={`sidebar-text ${collapsed ? "d-none" : ""}`}>{t("ListTourBooked")}</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/admin/postedlist">
                    <div className="sidebar-item">
                      <i className="fas fa-clipboard-list"></i>
                      <span className={`sidebar-text ${collapsed ? "d-none" : ""}`}>{t("ListPost")}</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/admin/userlist">
                    <div className="sidebar-item">
                      <i className="fas fa-users"></i>
                      <span className={`sidebar-text ${collapsed ? "d-none" : ""}`}>{t("ListUser")}</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/admin/commentManagement">
                    <div className="sidebar-item">
                      <i className="fas fa-cogs"></i>
                      <span className={`sidebar-text ${collapsed ? "d-none" : ""}`}>{t("commentManagement")}</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/admin/profile">
                    <div className="sidebar-item">
                      <i className="fas fa-user"></i>
                      <span className={`sidebar-text ${collapsed ? "d-none" : ""}`}>{t("profile")}</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/admin/statistics">
                    <div className="sidebar-item">
                      <i className="fas fa-chart-line"></i>
                      <span className={`sidebar-text ${collapsed ? "d-none" : ""}`}>{t("statistics")}</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <div onClick={handleCollapse} className="sidebar-item" style={{ cursor: 'pointer' }}>
                    <i className="fas fa-expand-arrows-alt"></i>
                    <span className={`sidebar-text ${collapsed ? "d-none" : ""}`}>{t("collapse")}</span>
                  </div>
                </li>
              </ul>
            </div>
          ) : (
            <div className="sidebar-section">
              <div className={`d-flex ${collapsed ? "d-none" : ""}`}>
                <i style={{ marginTop: 1.5, fontSize: "x-large" }} className="far fa-language"></i>
                <LanguageSwitcher changeLanguage={changeLanguage} />
              </div>
              <h2 className={`${collapsed ? "d-none" : ""}`}>{t("tourGuide")}</h2>
              <ul>
                <li>
                  <Link to="/tourguide/listtour">
                    <div className="sidebar-item">
                      <i className="fas fa-calendar-check"></i>
                      <span className={`sidebar-text ${collapsed ? "d-none" : ""}`}>{t("ListTourBooked")}</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/tourguide/contacts">
                    <div className="sidebar-item">
                      <i className="fas fa-address-book"></i>
                      <span className={`sidebar-text ${collapsed ? "d-none" : ""}`}>{t("contacts")}</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/tourguide/profile">
                    <div className="sidebar-item">
                      <i className="fas fa-user"></i>
                      <span className={`sidebar-text ${collapsed ? "d-none" : ""}`}>{t("profile")}</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <div onClick={handleCollapse} className="sidebar-item" style={{ cursor: 'pointer' }}>
                    <i className="fas fa-bars"></i>
                    <span className={`sidebar-text ${collapsed ? "d-none" : ""}`}>{t("collapse")}</span>
                  </div>
                </li>
              </ul>
            </div>
          )}
          <div className="sidebar-section sidebar-logout-section mt-auto">
            <ul>
              <li>
                <div onClick={handleLogout} className="sidebar-item" style={{ cursor: 'pointer' }}>
                  <i className="fas fa-sign-out-alt"></i>
                  <span className={`sidebar-text ${collapsed ? "d-none" : ""}`}>{t("logout")}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div>
        <Routes>
    {["/admin/tourbooked", "/tourguide/tourbooked"].map((path, index) => (
      <Route
        path={path}
        element={isAuthenticated ? <SearchBooking /> : <Navigate to="/admin/login" />}
        key={index}
      />
    ))}
    {["/admin/postedlist", "/tourguide/postedlist"].map((path, index) => (
      <Route
        path={path}
        element={isAuthenticated ? <PostedList /> : <Navigate to="/admin/login" />}
        key={index}
      />
    ))}
    {["/admin/userlist", "/tourguide/userlist"].map((path, index) => (
      <Route
        path={path}
        element={isAuthenticated ? <User /> : <Navigate to="/admin/login" />}
        key={index}
      />
    ))}
    <Route
      path="/comments"
      element={isAuthenticated ? <Comment /> : <Navigate to="/admin/login" />}
    />
    {["/admin/commentManagement", "/tourguide/commentManagement"].map((path, index) => (
      <Route
        path={path}
        element={isAuthenticated ? <Comment /> : <Navigate to="/admin/login" />}
        key={index}
      />
    ))}
    {["/admin/profile", "/tourguide/profile"].map((path, index) => (
      <Route
        path={path}
        element={isAuthenticated ? <PersonalProfile /> : <Navigate to="/admin/login" />}
        key={index}
      />
    ))}
    {/* Uncomment and add your Statistics route if needed */}
    <Route path="/admin/statistics" element={isAuthenticated ? <Statistics /> : <Navigate to="/admin/login" />} />
    <Route
        path="/admin/contacts"
        element={isAuthenticated ? <ContactList /> : <Navigate to="/admin/login" />}
      />
      <Route
        path="/tourguide/contacts"
        element={isAuthenticated ? <ContactList /> : <Navigate to="/admin/login" />}
      />
  </Routes>
      </div>
    </div>
  );
};

export default Sidebar;
