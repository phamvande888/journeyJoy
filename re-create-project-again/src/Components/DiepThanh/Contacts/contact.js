import React, { useEffect, useState } from "react";
import commonAPI from "../../CommonAPI/commonAPI";
import "./contact.css"; // Ensure this CSS file exists and is styled appropriately

const ContactList = () => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const getAdminListData = async () => {
      try {
        const data = await commonAPI.get("/tourguide/contactAdmin");
        console.log("=========ADMIN LIST DATA=========", data); // Filter to get only admins
        setAdmins(data.data);
      } catch (error) {
        console.log("ERROR getAdminListData MESSAGE METHOD GET:", error);
        setAdmins([]); // Optionally set admins to an empty array on error
      }
    };

    getAdminListData();
  }, []);

  const backgroundStyle = {
    background:
      'url("https://gtwallpaper.org/sites/default/files/wallpaper/165381/night-sky-1920x1080-wallpapers-165381-101557-3635423.png") no-repeat center center fixed',
    backgroundSize: "cover",
    minHeight: "100vh",
    padding: "20px",
  };

  return (
    <div style={backgroundStyle} className="contact-list-container">
      <a href="/tourguide" className="home-button">
        Back to page
      </a>
      <div className="contact-list">
        <h2>Danh sách liên lạc Admin</h2>
        <table className="contact-table">
          <thead>
            <tr>
              <th>Đại diện</th>
              <th>Tên</th>
              <th>Số điện thoại</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((contact) => (
              <tr key={contact.id}>
                <td>
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="contact-avatar"
                  />
                </td>
                <td>{contact.ho_ten}</td>
                <td>{contact.sdt}</td>
                <td>{contact.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactList;
