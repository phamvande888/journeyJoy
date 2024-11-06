import React, { useState } from "react";
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
import "./App.css";
import LanguageSwitcher from "./Components/DiepThanh/LanguageSwitcher/LanguageSwitcher";
import AdminIcon from "./Components/DiepThanh/Admin/admin";
import Sidebar from "./Components/DiepThanh/SideBar/Sidebar"; // Import the Sidebar component
import { useTranslation } from "react-i18next";
import i18n from "./Components/DiepThanh/i18n/i18n";
function App2() {
  const { t } = useTranslation();
  const [view, setView] = useState("");

  const toggleView = (viewType) => {
    setView(view === viewType ? "" : viewType);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    // <BrowserRouter>
    <div style={{ background: "rgb(15 30 45)" }} className="App vh-100">
      {/* Render the Sidebar component */}
      <Sidebar />
      <header className="App-header">
        <div className="top-right">
          <LanguageSwitcher className="mx-3" changeLanguage={changeLanguage} />
          <AdminIcon />
        </div>
        {/* <h1>{t("welcome")}</h1> */}
        {/* <div className="middle-screen">
          <button
            className="user-list-button"
            onClick={() => toggleView("user")}
          >
            {view === "user" ? t("hideUserList") : t("viewUserList")}
          </button>
          <button
            className="tour-list-button"
            onClick={() => toggleView("tour")}
          >
            {view === "tour" ? t("hideTourList") : t("viewTourList")}
          </button>
          {view === "user" && <UserList />}
          {view === "tour" && <TourList />}
          <></>
        </div> */}
      </header>
    </div>
    // </BrowserRouter>
  );
}

export default App2;
