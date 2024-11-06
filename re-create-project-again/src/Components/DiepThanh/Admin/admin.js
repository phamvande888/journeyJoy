import React, { useState, useEffect } from "react";
import PersonalProfile from "../../Quang/profile/ProfileAdminSite";
import "./admin.css"; // Import the CSS file for styling

const Admin = () => {
  const [showProfile, setShowProfile] = useState(false); // State for profile modal
  const [isOpen, setIsOpen] = useState(false); // State for admin menu visibility

  useEffect(() => {
    // Add class to body when Admin component is mounted
    document.body.classList.add('no-scroll');
    // Remove class from body when Admin component is unmounted
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  const openProfile = () => {
    setShowProfile(true); // Show profile modal
    setIsOpen(false); // Close admin menu when opening profile
  };

  const closeProfile = () => {
    setShowProfile(false); // Close profile modal
  };

  return (
    <div className="admin-background">
      <div className="welcome-text">Welcome Admin</div>
      {isOpen && (
        <div className="admin-menu">
          <div className="admin-menu-item" onClick={openProfile}>
            {/* <div className="profile-box">
              Profile
            </div> */}
          </div>
          {/* Add other menu items as needed */}
        </div>
      )}
      {showProfile && <PersonalProfile onClose={closeProfile} />}
    </div>
  );
};

export default Admin;
