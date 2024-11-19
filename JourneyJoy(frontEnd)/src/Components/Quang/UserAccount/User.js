import React, { useEffect, useState } from "react";
import commonAPI from "../../CommonAPI/commonAPI";
import userAccountInfo from "../../../DemoData/userAccountInfo.json";
import style from "./User.module.css";
import SearchBar from "../SearchBar/SearchBar";
import UserForm from "./UserForm";
import Sidebar from "../../DiepThanh/SideBar/Sidebar";
import styleSort from "../booking/sortBooking.module.css";

export default function User() {
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState(userAccountInfo);
  const [filteredUsers, setFilteredUsers] = useState(userAccountInfo);

  const handleSearch = (query) => {
    const filtered = users.filter(
      (user) =>
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.ho_ten.toLowerCase().includes(query.toLowerCase()) ||
        user.sdt.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const getUserListData = async () => {
    try {
      const data = await commonAPI.get("/admin/user");
      setUsers(data.content);
      setFilteredUsers(data.content); // Ensure filteredUsers is also updated
      console.log("=========USER LIST DATA=========", data);
    } catch (error) {
      console.log("ERROR getUserListData MESSAGE METHOD GET:", error);
      setUsers([]); // Optionally set users to an empty array on error
      setFilteredUsers([]); // Optionally set filteredUsers to an empty array on error
    }
  };

  useEffect(() => {
    getUserListData();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleUpdate = (updatedUser) => {
    const updatedUsers = users.map((u) =>
      u.id === updatedUser.id ? updatedUser : u
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setEditingUser(null); // Close the form after update
  };

  const handleBanUserAccount = async (userId, userStatus) => {
    try {
      const banned = !userStatus; // toggle the status
      console.log("BEFORE HANDLE BAN USER ACCOUNT", userId, banned);
      const data = await commonAPI.post(
        `/admin/user/updateBanStatus/${userId}?banned=${banned}`
      );
      alert("Ban user success!");
      const updatedUsers = users.map((u) =>
        u.id === userId ? { ...u, banned: banned } : u
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      console.log("SUCCESS Ban/Unban response data:", data);
    } catch (error) {
      console.error("Error banning/unbanning user:", error);
    }
  };

  const handleResetPassword = async (userId) => {
    try {
      const data = await commonAPI.put(`/api/user/update/resetPass/${userId}`);
      console.log("HANDLE RESET PASSWORD METHOD PUT", data);
    } catch (error) {
      console.log("HANDLE RESET PASSWORD METHOD PUT ERROR", error);
    }
  };

  const [sortOption, setSortOption] = useState("Sort by...");
  const handleSortChange = async (event) => {
    try {
      const selectedSortOption = event.target.value;
      setSortOption(selectedSortOption);
      const data = await commonAPI.get(`${selectedSortOption}`);
      console.log("DATA AFTER SORT", data);
      setUsers(data.content);
      setFilteredUsers(data.content); // Ensure filteredUsers is also updated
    } catch (error) {
      console.log("ERROR DATA AFTER SORT", error);
    }
  };

  const getStateLabel = (state) => {
    console.log("STATE GET STATE LABEL", state);
    switch (state) {
      case 0:
        return "Admin";
      case 1:
        return "Customer";
      case 2:
        return "Tour Guide";
      default:
        return "Reset";
    }
  };

  return (
    <div style={{ background: "rgb(15 30 45)" }}>
      <div className={`${style.userBiggestDiv} row mx-0 vh-100`}>
        <div className="col-2">
          <Sidebar />
        </div>
        <div className="col-10 px-3" style={{ position: "relative" }}>
          <div className="d-flex justify-content-center vh-screen">
            <SearchBar onSearch={handleSearch} className={style.searchBar} />
            <div className={styleSort.div}>
              <select
                value={sortOption}
                onChange={handleSortChange}
                className={style.sortBooking}
              >
                <option value="/admin/user" selected disabled hidden>
                  Sort by...
                </option>
                <option value="/admin/user">Reset</option>
                <option value="/admin/getUser">Customer</option>
                <option value="/admin/getAdmin">Admin</option>
                <option value="/admin/getTourGuide">Tour Guide</option>
              </select>
            </div>
            <div
              className={`${style.divWrap}`}
              style={{ position: "absolute", marginTop: "110px" }}
            >
              <div
                className={`${style.header} d-flex justify-content-around rounded-top-2`}
              >
                <h4 className="col-2 text-center">Email</h4>
                <h4 className="col-2 text-center">Họ tên</h4>
                <h4 className="col-2 text-center">Liên hệ</h4>
                <h4 className="col-2 text-center">Vai trò</h4>
                <h4 className="col-2 text-center">Địa chỉ</h4>
                <h4 className="col-2 text-center">Action</h4>
              </div>
              <div className="bg-white text-black rounded-bottom-2 pb-1">
                {users.map((user) => (
                  <div
                    className={`${style.pWarp} m-1 d-flex justify-content-around`}
                    key={user.id}
                  >
                    <p className={`${style.p} col-2 text-center`}>
                      {user.email}
                    </p>
                    <p className={`${style.p} col-2 text-center`}>
                      {user.ho_ten}
                    </p>
                    <p className={`${style.p} col-2 text-center`}>{user.sdt}</p>
                    <p className={`${style.p} col-2 text-center`}>
                      {getStateLabel(user.role)}
                    </p>
                    <p className={`${style.p} col-2 text-center`}>
                      {user.dia_chi}
                    </p>
                    <div className="col-2 text-center">
                      <button
                        onClick={() => handleEdit(user)}
                        type="button"
                        className="btn btn-outline-info p-1"
                      >
                        Info
                      </button>
                      <button
                        onClick={() =>
                          handleBanUserAccount(user.id, user.banned)
                        }
                        type="button"
                        className={`btn ${
                          user.banned === false
                            ? "btn-outline-danger"
                            : "btn-outline-success"
                        } mx-1 p-1`}
                      >
                        {user.banned === false ? "Ban" : "Unban"}
                      </button>
                      <button
                        onClick={() => handleResetPassword(user.id)}
                        type="button"
                        className="btn btn-outline-secondary p-1"
                      >
                        Reset <i className="fa-solid fa-key"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {editingUser && (
              <UserForm
                show={showModal}
                handleClose={() => setShowModal(false)}
                user={editingUser}
                onUpdate={handleUpdate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
